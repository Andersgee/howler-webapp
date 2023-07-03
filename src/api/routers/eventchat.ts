import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";
import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const eventchatRouter = createTRPCRouter({
  infiniteMessages: protectedProcedure
    .input(z.object({ cursor: z.number(), eventId: z.number() }))
    .query(async ({ input, ctx }) => {
      const LIMIT = 10;
      const messages = await db
        .selectFrom("Eventchatmessage")
        .selectAll("Eventchatmessage")
        .where("id", "<", input.cursor)
        .where("Eventchatmessage.eventchatId", "=", input.eventId)
        .orderBy("id", "desc")
        .limit(LIMIT)
        .execute();

      if (messages.length > LIMIT) {
        const nextItem = messages.pop();
        return { messages, nextCursor: nextItem?.id };
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
  send: protectedProcedure
    .input(z.object({ eventId: z.number(), text: z.string().max(280) }))
    .mutation(async ({ input, ctx }) => {
      //
      //todo: need to create a Eventchat before inserting into Eventchatmessage
      //
      const insertResult = await db
        .insertInto("Eventchatmessage")
        .values({
          eventchatId: input.eventId,
          userId: ctx.user.id,
          text: input.text,
        })
        .executeTakeFirst();

      const numInsertedRows = Number(insertResult.numInsertedOrUpdatedRows);
      if (!numInsertedRows) return false;

      //actually, send data to api instead,
      //save it to db there and hand off to fcm so that it can push to relevant fcmTokens aka users
      //look at Eventchat.userEventchatPivot.userId to know who to send to
      //or maybe just grab userId directly from UserEventchatPivot where eventchatId

      //const numInsertedRows = Number(insertResult.numInsertedOrUpdatedRows);
      //if (!numInsertedRows) return false;

      return true;
    }),
});
