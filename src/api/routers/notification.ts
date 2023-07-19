import { jsonArrayFrom } from "kysely/helpers/mysql";
//import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
  latest10: protectedProcedure.query(async ({ ctx }) => {
    const notifications = await db
      .selectFrom("UserNotificationPivot as p")
      .where("p.userId", "=", ctx.user.id)
      .limit(10)
      .innerJoin("Notification", "Notification.id", "p.notificationId")
      .selectAll("Notification")
      .execute();

    return notifications;
  }),
  latest10chat: protectedProcedure.query(async ({ ctx }) => {
    const userEventPivots = await db
      .selectFrom("UserEventPivot as p")
      .where("p.userId", "=", ctx.user.id)
      .orderBy("p.joinDate", "desc")
      .select((eb) => [
        "p.eventId",
        jsonArrayFrom(
          eb
            .selectFrom("Eventchatmessage as m")
            .select(["m.id", "m.createdAt", "m.text", "m.eventId", "m.userId"]) //(selectAll is not allowed in subquery)
            .whereRef("m.eventId", "=", "p.eventId")
            //.where("Eventchatmessage.userId","!=",ctx.user.id)
            .orderBy("m.id", "desc")
            .limit(10)
        ).as("messages"),
      ])
      .limit(10)
      .execute();

    return userEventPivots;
  }),
});
