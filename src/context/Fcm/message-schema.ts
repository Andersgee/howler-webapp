import { z } from "zod";

export const notificationDataSchema = z.object({
  type: z.literal("notification"),
  //fcmToken: z.string(),
  title: z.string(),
  body: z.string(),
  //imageUrl: z.string().optional(),
  linkUrl: z.string(),
  relativeLinkUrl: z.string(),
});

export type NotificationMessageData = z.infer<typeof notificationDataSchema>;

export const chatDataSchema = z.object({
  type: z.literal("chat"),
  id: z.number(),
  createdAt: z.date(),
  text: z.string(),
  eventchatId: z.number(),
  userId: z.number(),
});

export type ChatMessageData = z.infer<typeof chatDataSchema>;

export type FcmMessageData = NotificationMessageData | ChatMessageData;
