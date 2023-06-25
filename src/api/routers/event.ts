import { jsonObjectFrom } from "kysely/helpers/mysql";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { hashidFromId, idFromHashidOrThrow } from "#src/utils/hashid";
import { notifyEventCreated } from "#src/utils/notify";
import { tagEvents } from "#src/utils/tags";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  join: protectedProcedure.input(z.object({ eventHashId: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const eventId = idFromHashidOrThrow(input.eventHashId);

    const _insertResult = await ctx.db
      .insertInto("UserEventPivot")
      .values({
        eventId: eventId,
        userId: ctx.user.id,
      })
      .executeTakeFirstOrThrow();

    //revalidateTag(tagHasJoinedEvent({ eventId, userId: ctx.user.id }));

    return { eventId, userId: ctx.user.id };
  }),
  leave: protectedProcedure.input(z.object({ eventHashId: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const eventId = idFromHashidOrThrow(input.eventHashId);

    const _deleteResult = await ctx.db
      .deleteFrom("UserEventPivot")
      .where("userId", "=", ctx.user.id)
      .where("eventId", "=", eventId)
      .executeTakeFirstOrThrow();

    //revalidateTag(tagHasJoinedEvent({ eventId, userId: ctx.user.id }));
    return { eventId, userId: ctx.user.id };
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

      const insertresult = await ctx.db
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
      const hashid = hashidFromId(insertId);

      //await notifyEventCreated({ eventId: insertId });
      revalidateTag(tagEvents());

      return { eventId: insertId, eventHashId: hashid };
    }),

  info: publicProcedure.input(z.object({ eventHashId: z.string().min(1) })).query(async ({ input, ctx }) => {
    const eventId = idFromHashidOrThrow(input.eventHashId);

    const event = await ctx.db
      .selectFrom("Event")
      .selectAll("Event")
      .where("Event.id", "=", eventId)
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom("User")
            .select(["User.id", "User.name", "User.image"])
            .whereRef("User.id", "=", "Event.creatorId")
        ).as("creator"),
      ])
      .executeTakeFirstOrThrow();

    return event;
  }),
});
