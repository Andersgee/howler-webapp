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

export function getCurrentToken() {
  getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        console.log("currentToken:", currentToken);
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        // Show permission request UI
        console.log("No registration token available. Request permission to generate one.");
        // ...
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // ...
    });
}
