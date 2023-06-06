"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { setupMessaging } from "./util";
import type { FirebaseCloudMessaging } from "./firebas-cloud-messaging";
import type { MessagePayload } from "firebase/messaging";

export function useNotificationsContext() {
  const ctx = useContext(Context);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

/////////////////////////////////////////////////

type Value = {
  getMyFcmToken: () => Promise<string | null>;
  messages: MessagePayload[];
};

const Context = createContext<undefined | Value>(undefined);

/** setup service worker and firebase cloud messaging */
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const fcmRef = useRef<FirebaseCloudMessaging | null>(null);
  const [messages, setMessages] = useState<MessagePayload[]>([]);

  useEffect(() => {
    setupMessaging()
      .then((fcm) => {
        fcmRef.current = fcm;
        fcmRef.current.onMessage((payload) => {
          console.log("onMessage, payload:", payload);
          setMessages((msgs) => [...msgs, payload]);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getMyFcmToken = useCallback(async () => {
    if (!fcmRef.current) return null;
    return fcmRef.current.requestFcmToken();
  }, []);

  return <Context.Provider value={{ getMyFcmToken, messages }}>{children}</Context.Provider>;
}
