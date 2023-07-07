import { jsonObjectFrom } from "kysely/helpers/mysql";
import { z } from "zod";
import { db } from "#src/db";
import { postChatMessage } from "#src/utils/notify";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const eventchatRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ eventId: z.number() })).mutation(async ({ input, ctx }) => {
    return true;
  }),
  send: protectedProcedure
    .input(z.object({ eventId: z.number(), text: z.string().max(280) }))
    .mutation(async ({ input, ctx }) => {
      const res = await postChatMessage({ eventId: input.eventId, userId: ctx.user.id, text: input.text });
      if (!res.ok) return false;

      return true;
    }),
  infiniteMessages: protectedProcedure
    .input(z.object({ cursor: z.number().optional(), eventId: z.number() }))
    .query(async ({ input, ctx }) => {
      //await new Promise((resolve) => setTimeout(resolve, 2000));

      const LIMIT = 30;

      let query = db
        .selectFrom("Eventchatmessage")
        .selectAll("Eventchatmessage")
        .where("Eventchatmessage.eventId", "=", input.eventId)
        .orderBy("id", "desc")
        .limit(LIMIT + 1);

      if (input.cursor !== undefined) {
        query = query.where("id", "<=", input.cursor);
      }
      const messages = await query.execute();

      if (messages.length > LIMIT) {
        //const nextItem = messages.pop();
        const nextItem = messages.pop();
        const nextCursor = nextItem?.id;
        return { messages, nextCursor };
      } else {
        return { messages, nextCursor: undefined };
      }
    }),

  latest10: protectedProcedure.input(z.object({ eventId: z.number() })).query(async ({ input, ctx }) => {
    const messages = await db
      .selectFrom("Eventchatmessage")
      .selectAll("Eventchatmessage")
      .where("id", "=", input.eventId)
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom("User")
            .select(["User.id", "User.name", "User.image"])
            .whereRef("User.id", "=", "Eventchatmessage.userId")
        ).as("user"),
      ])
      .orderBy("id", "desc")
      //.offset(0)
      .limit(10)
      .execute();

    return messages;
  }),
});
