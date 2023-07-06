import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
  latest10: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ input, ctx }) => {
    const notifications = await db
      .selectFrom("UserNotificationPivot as p")
      .where("p.userId", "=", ctx.user.id)
      .limit(10)
      .innerJoin("Notification", "Notification.id", "p.notificationId")
      .selectAll("Notification")
      .execute();

    return notifications;
  }),
});
