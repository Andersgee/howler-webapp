import type { MessagePayload } from "firebase/messaging";
import type { StateCreator } from "zustand";
import { FirebaseCloudMessaging } from "#src/components/CloudMessaging/firebase-cloud-messaging";
import { registerSW } from "#src/utils/service-worker";

//import { GoogleMaps } from "#src/components/GoogleMap/google-maps";

export type FcmSlice = {
  fcm: FirebaseCloudMessaging | null;
  fcmLatestMessagePayload: MessagePayload | null;
};

export const createFcmSlice: StateCreator<FcmSlice, [], [], FcmSlice> = (set) => ({
  fcm: null,
  fcmLatestMessagePayload: null,
  initFcm: async () => {
    const registration = await registerSW();
    if (registration) {
      const fcm = new FirebaseCloudMessaging(registration);
      const ok = await fcm.init();
      if (ok) {
        set({ fcm });
      }
    }
  },
});
