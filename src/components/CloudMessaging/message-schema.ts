import { z } from "zod";

export const notificationDataSchema = z.object({
  type: z.literal("notification"),
  id: z.number(),
  title: z.string(),
  body: z.string(),
  imageUrl: z.string().nullable(),
  linkUrl: z.string(),
  relativeLinkUrl: z.string(),
});

export type NotificationMessageData = z.infer<typeof notificationDataSchema>;

export const chatDataSchema = z.object({
  type: z.literal("chat"),
  title: z.string(),
  id: z.number(),
  createdAt: z.date(),
  text: z.string(),
  eventId: z.number(),
  userId: z.number(),
});

export type ChatMessageData = z.infer<typeof chatDataSchema>;

export type FcmMessageData = NotificationMessageData | ChatMessageData;
