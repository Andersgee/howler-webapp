import { z } from "zod";
import { hashidFromId, idFromHashidOrThrow } from "#src/utils/hashid";
import { notifyEventCreated } from "#src/utils/notify";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  join: protectedProcedure.input(z.object({ eventHashId: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const eventId = idFromHashidOrThrow(input.eventHashId);

    const _insertResult = await ctx.db
      .insertInto("UserEventPivot")
      .values({
        eventId: eventId,
        userId: ctx.user.id,
      })
      .executeTakeFirst();

    console.log({ _insertResult });
    //revalidateTag(tagHasJoinedEvent({ eventId, userId: ctx.user.id }));

    return { eventId, userId: ctx.user.id };
  }),
  leave: protectedProcedure.input(z.object({ eventHashId: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const eventId = idFromHashidOrThrow(input.eventHashId);

    const _deleteResult = await ctx.db
      .deleteFrom("UserEventPivot")
      .where("userId", "=", ctx.user.id)
      .where("eventId", "=", eventId)
      .executeTakeFirst();

    console.log({ _deleteResult });

    //revalidateTag(tagHasJoinedEvent({ eventId, userId: ctx.user.id }));
    return { eventId, userId: ctx.user.id };
  }),
  create: protectedProcedure
    .input(
      z.object({
        what: z.string(),
        where: z.string(),
        when: z.number(),
        whenEnd: z.number(),
        who: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // simulate a slow db call
      //await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log({ input });

      const creatorId = ctx.user.id;
      const when = new Date(input.when);
      const whenEnd = new Date(input.whenEnd);
      console.log({ creatorId, when, whenEnd });

      try {
        const insertresult = await ctx.db
          .insertInto("Event")
          .values({
            creatorId: ctx.user.id,
            what: input.what,
            where: input.where,
            when: when,
            whenEnd: whenEnd,
            who: input.who,
            info: "no info",
          })
          .executeTakeFirstOrThrow();

        console.log({ insertresult });
      } catch (err) {
        console.log("insertResponse error:", err);
      }
      /*

      const insertId = Number(insertresult.insertId);
      const hashid = hashidFromId(insertId);

      console.log({ insertId, hashid });

      //await notifyEventCreated({ eventId: insertId });

      //redirect(`/event/${hashid}`);
      //revalidateTag(tagEvents());
      //return { eventId: insertId, eventHashId: hashid };

      */
      return "hello";
    }),
});
