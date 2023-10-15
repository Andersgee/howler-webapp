import { initializeApp, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import type { MessagePayload, Messaging } from "firebase/messaging";
import { setFcmLatestMessagePayload } from "#src/store/actions";
import { notificationsAlreadyGranted, requestNotificationPermission } from "#src/utils/notification";
import { postFcmToken } from "./utils";

/**
 * Note: The Firebase config object contains unique, but non-secret identifiers for your Firebase project.
 * @see https://firebase.google.com/docs/web/learn-more#config-object
 * */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAroe8n3vb7b9FooVuf8Q9UAXXcCIZ4SNI",
  authDomain: "howler-67f34.firebaseapp.com",
  projectId: "howler-67f34",
  storageBucket: "howler-67f34.appspot.com",
  messagingSenderId: "942074740899",
  appId: "1:942074740899:web:f7b3aec1d8bead76b2ff16",
};

/**
 * simpler wrapper for interacting with Firebase cloud messaging service
 */
export class FirebaseCloudMessaging {
  app: FirebaseApp;
  messaging: Messaging;
  serviceWorkerRegistration: ServiceWorkerRegistration;
  fcmToken: string | null;
  constructor(serviceWorkerRegistration: ServiceWorkerRegistration) {
    this.app = initializeApp(FIREBASE_CONFIG);
    this.messaging = getMessaging(this.app);
    this.serviceWorkerRegistration = serviceWorkerRegistration;
    this.fcmToken = null;
  }

  async getFcmToken() {
    if (!notificationsAlreadyGranted()) return false;
    try {
      const token = await getToken(this.messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
        serviceWorkerRegistration: this.serviceWorkerRegistration,
      });
      this.fcmToken = token;
      const ok = await postFcmToken(token);
      return ok;
    } catch (error) {
      return false;
    }
  }

  async init() {
    await this.getFcmToken();
    onMessage(this.messaging, (payload: MessagePayload) => setFcmLatestMessagePayload(payload));
    return true;
  }

  /** call this on button clicks etc, instead of right away when app loads  */
  async maybeRequestNotificationPermission() {
    if (this.fcmToken) return true;

    try {
      const granted = await requestNotificationPermission();
      if (!granted) return false;
      const ok = this.getFcmToken();
      return ok;
    } catch (error) {
      //console.error(errorMessageFromUnkown(error));
      return false;
    }
  }
}
