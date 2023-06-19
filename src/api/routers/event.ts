import { revalidateTag } from "next/cache";
import { z } from "zod";
import { hashidFromId, idFromHashid } from "#src/utils/hashid";
import { notifyEventCreated } from "#src/utils/notify";
import { tagHasJoinedEvent } from "#src/utils/tags";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  join: protectedProcedure.input(z.object({ eventHashId: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const eventId = idFromHashid(input.eventHashId);
    if (!eventId) return false;

    const _insertResult = await ctx.db
      .insertInto("UserEventPivot")
      .values({
        eventId: eventId,
        userId: ctx.user.id,
      })
      .executeTakeFirst();

    revalidateTag(tagHasJoinedEvent({ eventId, userId: ctx.user.id }));
    return true;
  }),
  leave: protectedProcedure.input(z.object({ eventHashId: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const eventId = idFromHashid(input.eventHashId);
    if (!eventId) return false;

    const _deleteResult = await ctx.db
      .deleteFrom("UserEventPivot")
      .where("userId", "=", ctx.user.id)
      .where("eventId", "=", eventId)
      .executeTakeFirst();

    revalidateTag(tagHasJoinedEvent({ eventId, userId: ctx.user.id }));
    return true;
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
      const insertresult = await ctx.db
        .insertInto("Event")
        .values({
          creatorId: ctx.user.id,
          what: input.what,
          where: input.where,
          when: input.when,
          whenEnd: input.whenEnd,
          who: input.who,
          info: "",
        })
        .executeTakeFirst();

      const insertId = Number(insertresult.insertId);
      const hashid = hashidFromId(insertId);

      await notifyEventCreated({ eventId: insertId });

      //redirect(`/event/${hashid}`);
      return { hashid };
    }),
});
