import { parse } from "devalue";
import { z } from "zod";
import type { NotificationData } from "#src/context/NotificationsContext/types";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
  latest10: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ input, ctx }) => {
    const notifications = await db
      .selectFrom("Notification")
      .selectAll()
      .where("userId", "=", ctx.user.id)
      .orderBy("id", "desc")
      //.offset(0)
      .limit(10)
      .execute();

    const parsedNotifications = notifications.map((notification) => ({
      id: notification.id,
      userId: notification.userId,
      data: parse(notification.data) as NotificationData,
    }));

    return parsedNotifications;
  }),
});
