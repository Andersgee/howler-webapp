import { initializeApp, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import type { MessagePayload, Messaging } from "firebase/messaging";

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
 * */
export class FirebaseCloudMessaging {
  app: FirebaseApp;
  messaging: Messaging;
  serviceWorkerRegistration: ServiceWorkerRegistration;
  fcmToken: string | null;
  constructor(serviceWorkerRegistration: ServiceWorkerRegistration) {
    this.app = initializeApp(FIREBASE_CONFIG);
    this.messaging = getMessaging(this.app);
    this.serviceWorkerRegistration = serviceWorkerRegistration;
    //this.serviceWorkerRegistration = null;
    this.fcmToken = null;

    //onMessage(this.messaging, onMsg);
  }

  onMessage(onMsg: (payload: MessagePayload) => void) {
    onMessage(this.messaging, onMsg);
  }

  /**
   * get fcm token, will NOT ask for permission (meaning it returns null if permissions not already granted)
   *
   * will get a token if we dont already have one **and** permissions are already granted
   */
  async getFcmToken() {
    if (this.fcmToken) return this.fcmToken;

    //getToken() from firebase would prompt for permission if notifications are not already granted
    //but handle it manually
    if (!notificationsAlreadyGranted()) return null;

    try {
      const token = await getToken(this.messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
        serviceWorkerRegistration: this.serviceWorkerRegistration,
      });
      this.fcmToken = token;
      return this.fcmToken;
    } catch (error) {
      //console.error(errorMessageFromUnkown(error));
      return null;
    }
  }

  /**
   * get fcm token, will ask for permission if not already granted
   */
  async requestFcmToken() {
    if (this.fcmToken) return this.fcmToken;

    try {
      const granted = await requestNotificationPermission();
      if (!granted) return null;
      //getToken() asks for permission if not already granted
      const token = await getToken(this.messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
        serviceWorkerRegistration: this.serviceWorkerRegistration,
      });
      this.fcmToken = token;
      return this.fcmToken;
    } catch (error) {
      //console.error(errorMessageFromUnkown(error));
      return null;
    }
  }
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;

  if ("Notification" in window && Notification.permission === "denied") {
    alert(
      "Notifications are blocked. Please open your browser preferences or click the lock near the address bar to change your notification preferences."
    );
    return false;
  }

  if ("Notification" in window && Notification.permission === "granted") return true;

  const permission = await Notification.requestPermission();
  if (permission === "granted") return true;
  return false;
}

export function notificationsAlreadyGranted() {
  if ("Notification" in window && Notification.permission === "granted") return true;
  return false;
}
