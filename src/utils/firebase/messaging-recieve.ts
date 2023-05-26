import { getMessaging, onMessage } from "firebase/messaging";

const messaging = getMessaging();

export function onMessageListenerx() {
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.onBackgroundMessage` handler.
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    // ...
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });
