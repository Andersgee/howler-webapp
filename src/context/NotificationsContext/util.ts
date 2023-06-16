import { FirebaseCloudMessaging } from "./firebas-cloud-messaging";

export async function setupMessaging() {
  const swRegistration = await registerSW();
  if (!swRegistration) throw new Error("no swRegistration");

  const fcm = new FirebaseCloudMessaging(swRegistration);

  const token = await fcm.getFcmToken();
  if (token) {
    console.log("notification permission already granted, token:", token);
  }
  return fcm;
}

async function registerSW() {
  try {
    if (!("serviceWorker" in navigator)) {
      console.log("service worker not available in navigator");
      return null;
    }

    const registration = await navigator.serviceWorker.register("/sw.js", { type: "module", scope: "/" });

    //const registrationToken = await getFcmRegistrationToken(registration);

    //force update or not?
    //https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
    //await registration.update() //force update unless the existing is identical
    console.log("registered service worker");
    return registration;
  } catch (e) {
    console.log("registering service worker failed:", e);
    return null;
  }
}

function unregisterSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}
