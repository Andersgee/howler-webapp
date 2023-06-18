"use client";

import type { MessagePayload } from "firebase/messaging";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { buttonVariants } from "#src/components/ui/Button";
import { toast } from "#src/hooks/use-toast";
import type { FirebaseCloudMessaging } from "./firebas-cloud-messaging";
import { setupMessaging } from "./util";

export function useNotificationsContext() {
  const ctx = useContext(Context);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

/////////////////////////////////////////////////

type Value = {
  fcmToken: string | null;
  getFcmToken: () => Promise<string | null>;
  messages: MessagePayload[];
};

const Context = createContext<undefined | Value>(undefined);

async function postFcmToken(fcmToken: string) {
  const res = await fetch("/api/fcmtoken", {
    method: "POST",
    body: JSON.stringify({ fcmToken }),
  });
  if (res.status === 200) {
    //saved it to db
    return true;
  }
  return false;
}

/** setup service worker and firebase cloud messaging */
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const fcmRef = useRef<FirebaseCloudMessaging | null>(null);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const onMessage = useCallback(
    ({
      title,
      description,
      link,
      linkText,
    }: {
      title: string;
      description: string;
      link: string;
      linkText: string;
    }) => {
      const { dismiss } = toast({
        title: title,
        description: description,
        variant: "default",
        action: (
          <a className={buttonVariants({ variant: "outline" })} onClick={() => dismiss()} href={link}>
            {linkText}
          </a>
        ),
      });
    },
    []
  );

  useEffect(() => {
    console.log("running setupMessaging effect");
    setupMessaging()
      .then((fcm) => {
        fcmRef.current = fcm;
        fcmRef.current.onMessage((payload) => {
          if (payload.notification?.title && payload.notification?.body && payload.fcmOptions?.link) {
            onMessage({
              title: payload.notification.title,
              description: payload.notification.body,
              link: payload.fcmOptions.link,
              linkText: "Show me",
            });
          } else {
            console.log("couldnt toast.. onMessage, payload:", payload);
          }
          setMessages((msgs) => [...msgs, payload]);
        });
        if (fcmRef.current.fcmToken) {
          setFcmToken(fcmRef.current.fcmToken);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [onMessage]);

  useEffect(() => {
    if (fcmToken) {
      postFcmToken(fcmToken)
        .then((_r) => {
          //ignore
        })
        .catch((_err) => {
          //ignore
        });
    }
  }, [fcmToken]);

  const getFcmToken = useCallback(async () => {
    if (!fcmRef.current) return null;
    //if (fcmRef.current.fcmToken) return fcmRef.current.fcmToken;

    const token = await fcmRef.current.requestFcmToken();
    setFcmToken(token);

    return token;
  }, []);

  return <Context.Provider value={{ fcmToken, getFcmToken, messages }}>{children}</Context.Provider>;
}
