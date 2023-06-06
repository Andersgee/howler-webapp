import { initializeApp, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import type { Messaging, MessagePayload } from "firebase/messaging";

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
      console.log(error);
      return null;
    }
  }

  /**
   * get fcm token, will ask for permission if not already granted
   */
  async requestFcmToken() {
    if (this.fcmToken) return this.fcmToken;

    try {
      //getToken() asks for permission if not already granted
      const token = await getToken(this.messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
        serviceWorkerRegistration: this.serviceWorkerRegistration,
      });
      this.fcmToken = token;
      return this.fcmToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;

  const permission = await Notification.requestPermission();
  if (permission === "granted") return true;
  return false;
}

export function notificationsAlreadyGranted() {
  if ("Notification" in window && Notification.permission === "granted") return true;
  return false;
}

/**
 * returns the "device id" basically. Use this id later (on server side) to send messages to it
 *
 * can also subscribe it to "topics" and send a topicMessage (instead of tokenMessage)
 *
 * TODO: find out if this changes everytime you open the app or what? do I need to keep track of if different tokens are actually same user?
 * or is this just 'for a single registration to a topic'? or a single session or what
 *
 * the docstring sais it subscribes the messaging instance to push notifications
 */
/*
async function getFcmRegistrationToken(messaging: Messaging, serviceWorkerRegistration: ServiceWorkerRegistration) {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
      serviceWorkerRegistration,
    });
    // Send the token to your server and update the UI if necessary
    return token;
  } catch (error) {
    //use clicked "no" on accept notifications
    console.log("need to ask for permission again probably, they clicked DONT allow notifications.");
    return undefined;
  }
}
*/
