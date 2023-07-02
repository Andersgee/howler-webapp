import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/mysql";
import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const eventchatRouter = createTRPCRouter({
  latest10: protectedProcedure.input(z.object({ eventId: z.number() })).query(async ({ input, ctx }) => {
    const chatMessages = await db
      .selectFrom("EventChatMessage")
      .selectAll("EventChatMessage")
      .where("eventId", "=", input.eventId)
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom("User")
            .select(["User.id", "User.name", "User.image"])
            .whereRef("User.id", "=", "EventChatMessage.creatorId")
        ).as("creator"),
      ])
      .orderBy("id", "desc")
      //.offset(0)
      .limit(10)
      .execute();

    return chatMessages;
  }),
  send: protectedProcedure
    .input(z.object({ eventId: z.number(), text: z.string().max(280) }))
    .mutation(async ({ input, ctx }) => {
      const values = {
        eventId: input.eventId,
        creatorId: ctx.user.id,
        text: input.text,
      };

      const insertResult = await db.insertInto("EventChatMessage").values(values).executeTakeFirst();

      const numInsertedRows = Number(insertResult.numInsertedOrUpdatedRows);
      if (!numInsertedRows) return false;

      //actually, send data to api instead,
      //save it to db there and hand off to fcm so that it can push to relevant fcmTokens aka users
      //prob look in db for any users looking at this event right now
      //meaning when navigating to an event, we need to tell db that we are looking at it.
      //or perhaps do it when joining... yeah, need to have alerts on aswell, even for messages,

      //const numInsertedRows = Number(insertResult.numInsertedOrUpdatedRows);
      //if (!numInsertedRows) return false;

      return true;
    }),
});
