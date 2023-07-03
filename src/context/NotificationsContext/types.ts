import { z } from "zod";

export const notificationDataSchema = z.object({
  fcmToken: z.string(),
  title: z.string(),
  body: z.string(),
  //imageUrl: z.string().optional(),
  linkUrl: z.string(),
  relativeLinkUrl: z.string(),
});

export type NotificationData = z.infer<typeof notificationDataSchema>;
