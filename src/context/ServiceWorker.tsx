"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import type { Prettify } from "src/utils/typescript";

export function useServiceWorkerContext() {
  const ctx = useContext(Context);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

export function useServiceWorkerDispatch() {
  const ctx = useContext(DispatchContext);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

/////////////////////////////////////////////////

const initialState = "none";

const Context = createContext<undefined | Value>(undefined);
const DispatchContext = createContext<undefined | React.Dispatch<Action>>(undefined);

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [value, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    //registerSW().then((r) => {
    //  //ignore
    //});
  }, []);

  return (
    <Context.Provider value={value}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </Context.Provider>
  );
}

type Type = "show" | "hide";
type Name = "signin" | "warning";
type Value = Prettify<"none" | Name>;
type Action = { type: Type; name: Name };

function reducer(value: Value, action: Action): Value {
  if (action.type === "show") {
    return action.name;
  } else if (action.type === "hide" && value === action.name) {
    return "none";
  }
  return value;
}

async function registerSW() {
  try {
    if (!("serviceWorker" in navigator)) {
      console.log("service worker not available in navigator");
      return null;
    }

    const registration = await navigator.serviceWorker.register("/sw.js", { type: "module", scope: "/" });

    //const subscription = await registration.pushManager.getSubscription()

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
