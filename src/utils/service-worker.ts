const SERVICE_WORKER_PATH = "/sw.js";

export async function registerSW() {
  try {
    if (!("serviceWorker" in navigator)) return null;

    const registration = await navigator.serviceWorker.register(SERVICE_WORKER_PATH, { type: "module", scope: "/" });

    //force update or not?
    //https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
    //await registration.update() //force update unless the existing is identical
    return registration;
  } catch (error) {
    //console.error(errorMessageFromUnkown(error));
    return null;
  }
}

export async function unregisterSW() {
  try {
    if (!("serviceWorker" in navigator)) return false;

    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    return true;
  } catch (error) {
    return false;
  }
}
