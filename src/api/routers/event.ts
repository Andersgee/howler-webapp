import { jsonObjectFrom } from "kysely/helpers/mysql";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { hashidFromId } from "#src/utils/hashid";
import { notifyEventCreated } from "#src/utils/notify";
import { getEventInfo, getHasJoinedEvent, tagEventInfo, tagEvents, tagHasJoinedEvent } from "#src/utils/tags";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  isJoined: protectedProcedure.input(z.object({ eventId: z.number() })).query(async ({ input, ctx }) => {
    return getHasJoinedEvent({ eventId: input.eventId, userId: ctx.user.id });
  }),
  info: publicProcedure.input(z.object({ eventId: z.number() })).query(async ({ input, ctx }) => {
    return getEventInfo({ eventId: input.eventId });
  }),
  join: protectedProcedure.input(z.object({ eventId: z.number() })).mutation(async ({ input, ctx }) => {
    const _insertResult = await ctx.db
      .insertInto("UserEventPivot")
      .values({
        eventId: input.eventId,
        userId: ctx.user.id,
      })
      .executeTakeFirstOrThrow();

    revalidateTag(tagHasJoinedEvent({ eventId: input.eventId, userId: ctx.user.id }));

    return { eventId: input.eventId, userId: ctx.user.id };
  }),
  leave: protectedProcedure.input(z.object({ eventId: z.number() })).mutation(async ({ input, ctx }) => {
    const _deleteResult = await ctx.db
      .deleteFrom("UserEventPivot")
      .where("userId", "=", ctx.user.id)
      .where("eventId", "=", input.eventId)
      .executeTakeFirstOrThrow();

    revalidateTag(tagHasJoinedEvent({ eventId: input.eventId, userId: ctx.user.id }));
    return { eventId: input.eventId, userId: ctx.user.id };
  }),
  create: protectedProcedure
    .input(
      z.object({
        what: z.string(),
        where: z.string(),
        when: z.date(),
        whenEnd: z.date(),
        who: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // simulate a slow db call
      //await new Promise((resolve) => setTimeout(resolve, 2000));

      const insertresult = await db
        .insertInto("Event")
        .values({
          creatorId: ctx.user.id,
          what: input.what,
          where: input.where,
          when: input.when,
          whenEnd: input.whenEnd,
          who: input.who,
          info: "no info",
        })
        .executeTakeFirstOrThrow();
      const insertId = Number(insertresult.insertId);

      //auto join creator to event
      await db
        .insertInto("UserEventPivot")
        .values({
          eventId: insertId,
          userId: ctx.user.id,
        })
        .execute();

      const hashid = hashidFromId(insertId);

      await notifyEventCreated({ eventId: insertId });
      revalidateTag(tagEvents());

      return { eventId: insertId, eventHashId: hashid };
    }),

  update: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        what: z.string(),
        where: z.string(),
        when: z.date(),
        whenEnd: z.date(),
        who: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const _updateResult = await db
        .updateTable("Event")
        .where("id", "=", input.eventId)
        .set({
          what: input.what,
          where: input.where,
          when: input.when,
          whenEnd: input.whenEnd,
          who: input.who,
        })
        .executeTakeFirstOrThrow();

      const eventInfo = getEventInfo({ eventId: input.eventId, cached: false });

      revalidateTag(tagEventInfo({ eventId: input.eventId }));
      revalidateTag(tagEvents());

      return eventInfo;
    }),
});
