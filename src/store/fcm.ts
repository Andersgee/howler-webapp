import type { MessagePayload } from "firebase/messaging";
import type { StateCreator } from "zustand";
import { FirebaseCloudMessaging } from "#src/components/CloudMessaging/firebase-cloud-messaging";
import type { ChatMessageData, NotificationMessageData } from "#src/context/Fcm/message-schema";
import { registerSW } from "#src/utils/service-worker";

//import { GoogleMaps } from "#src/components/GoogleMap/google-maps";

type UnseenChatMessage = { eventId: number; unseen: number };

type newChatMessage = Omit<ChatMessageData, "type" | "title">;

export type FcmSlice = {
  fcm: FirebaseCloudMessaging | null;
  initFcm: () => void;
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
  initFcm: async () => {
    if (get().fcm !== null) return;

    const registration = await registerSW();
    if (registration) {
      const fcm = new FirebaseCloudMessaging(registration);
      const ok = await fcm.init();
      if (ok) {
        set({ fcm });
      }
    }
  },
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
