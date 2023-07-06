import { FirebaseCloudMessaging } from "./firebas-cloud-messaging";

export async function setupMessaging() {
  const swRegistration = await registerSW();
  if (!swRegistration) throw new Error("no swRegistration");

  const fcm = new FirebaseCloudMessaging(swRegistration);

  const _token = await fcm.getFcmToken();
  return fcm;
}

async function registerSW() {
  try {
    if (!("serviceWorker" in navigator)) return null;

    const registration = await navigator.serviceWorker.register("/sw.js", { type: "module", scope: "/" });

    //force update or not?
    //https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
    //await registration.update() //force update unless the existing is identical
    return registration;
  } catch (error) {
    //console.error(errorMessageFromUnkown(error));
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
