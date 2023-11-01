import type { MessagePayload } from "firebase/messaging";
import type { StateCreator } from "zustand";
import { type FirebaseCloudMessaging } from "#src/components/CloudMessaging/firebase-cloud-messaging";
import type { ChatMessageData, NotificationMessageData } from "#src/components/CloudMessaging/message-schema";

type UnseenChatMessage = { eventId: number; unseen: number };

type newChatMessage = Omit<ChatMessageData, "type" | "title">;

export type FcmSlice = {
  fcm: FirebaseCloudMessaging | null;
  fcmLatestMessagePayload: MessagePayload | null;
  fcmNotificationMessages: NotificationMessageData[];
  fcmAddNotificationMessage: (d: NotificationMessageData) => void;
  fcmUnseenChatMessages: UnseenChatMessage[];
  fcmAddUnseenChatMessage: (d: newChatMessage) => void;
  fcmClearChatNotifications: () => void;
  fcmClearEventChatNotifications: (eventId: number) => void;
};

export const createFcmSlice: StateCreator<FcmSlice, [], [], FcmSlice> = (set, get) => ({
  fcm: null,
  fcmLatestMessagePayload: null,
  fcmNotificationMessages: [],
  fcmAddNotificationMessage: (d) => set((prev) => ({ fcmNotificationMessages: [d, ...prev.fcmNotificationMessages] })),
  fcmUnseenChatMessages: [],
  fcmAddUnseenChatMessage: (newChatMessage) => {
    const prev = get().fcmUnseenChatMessages;

    const eventId = newChatMessage.eventId;
    const data = structuredClone(prev);
    const existing = data.find((x) => x.eventId === eventId);
    if (existing) {
      existing.unseen += 1;
    } else {
      data.unshift({
        eventId,
        unseen: 1,
      });
    }
    set({ fcmUnseenChatMessages: data });
  },
  fcmClearChatNotifications: () => set({ fcmUnseenChatMessages: [] }),
  fcmClearEventChatNotifications: (eventId) => {
    const prev = get().fcmUnseenChatMessages;
    const data = prev.filter((x) => x.eventId !== eventId);
    set({ fcmUnseenChatMessages: data });
  },
});
