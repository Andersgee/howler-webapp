"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { FirebaseCloudMessaging } from "./firebas-cloud-messaging";

export function useServiceWorkerContext() {
  const ctx = useContext(Context);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

/////////////////////////////////////////////////

type Value = {
  x: number;
};

const Context = createContext<undefined | Value>(undefined);

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [x, setX] = useState(0);

  useEffect(() => {
    initSwAndFcm()
      .then((fcmToken) => {
        console.log("fcmToken:", fcmToken);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return <Context.Provider value={{ x }}>{children}</Context.Provider>;
}

async function initSwAndFcm() {
  const registration = await registerSW();
  if (!registration) return null;
  const fcm = new FirebaseCloudMessaging(registration);
  return fcm.getFcmToken();
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
    //await registration.update() //force update unless the ?
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
