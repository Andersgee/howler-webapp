import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

//https://firebase.google.com/docs/cloud-messaging/js/client#web-version-9

//also: https://github.com/firebase/quickstart-js/tree/master/messaging

//Note: The Firebase config object contains unique, but non-secret identifiers for your Firebase project.
const firebaseConfig = {
  apiKey: "AIzaSyAroe8n3vb7b9FooVuf8Q9UAXXcCIZ4SNI",
  authDomain: "howler-67f34.firebaseapp.com",
  projectId: "howler-67f34",
  storageBucket: "howler-67f34.appspot.com",
  messagingSenderId: "942074740899",
  appId: "1:942074740899:web:f7b3aec1d8bead76b2ff16",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

//const messaging = getMessaging();

export function requestNotificationPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  });
}

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.

/**
 * returns the "device id" basically. Use this id later (on server side) to subscribe it to "topics"
 *
 * and even later, we can send messages to topics
 *
 * TODO: find out if this changes everytime you open the app or what? do I need to keep track of if different tokens are actually same user?
 * or is this just 'for a single registration to a topic'? or a single session or what
 *
 * the docstring sais it subscribes the messaging instance to push notifications
 */
export async function getFcmRegistrationToken(serviceWorkerRegistration: ServiceWorkerRegistration) {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
      serviceWorkerRegistration,
    });
    // Send the token to your server and update the UI if necessary
    return token;
  } catch (error) {
    //use clicked "no" on accept notifications
    console.log("need to ask for permission again probably, they clicked no on allow notifications.");
  }
}
