"use client";

import { parse } from "devalue";
import type { MessagePayload } from "firebase/messaging";
//import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
//import { buttonVariants } from "#src/components/ui/Button";
//import { toast } from "#src/hooks/use-toast";
//import { cn } from "#src/utils/cn";
import type { FirebaseCloudMessaging } from "./firebas-cloud-messaging";
import {
  chatDataSchema,
  notificationDataSchema,
  type ChatMessageData,
  type FcmMessageData,
  type NotificationMessageData,
} from "./message-schema";
import { setupMessaging } from "./util";

export function useFcmContext() {
  const ctx = useContext(Context);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

/////////////////////////////////////////////////

type Value = {
  fcmToken: string | null;
  getFcmToken: () => Promise<string | null>;
  notificationMessages: NotificationMessageData[];
  chatMessages: ChatMessageData[];
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
export function FcmProvider({ children }: { children: React.ReactNode }) {
  const fcmRef = useRef<FirebaseCloudMessaging | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationMessages, setNotificationMessages] = useState<NotificationMessageData[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([]);

  useEffect(() => {
    setupMessaging()
      .then((fcm) => {
        fcmRef.current = fcm;
        fcmRef.current.onMessage((payload) => {
          const dataStr = payload.data?.str;
          if (!dataStr) return;

          const messageData = parse(dataStr) as FcmMessageData;

          if (messageData.type === "notification") {
            const parsed = notificationDataSchema.safeParse(messageData);
            if (parsed.success) {
              setNotificationMessages((v) => [...v, parsed.data]);
            }
          } else if (messageData.type === "chat") {
            const parsed = chatDataSchema.safeParse(messageData);
            if (parsed.success) {
              setChatMessages((v) => [...v, parsed.data]);
            }
          } else {
            console.log("ignoring payload.data: ", payload.data);
          }
        });
        if (fcmRef.current.fcmToken) {
          setFcmToken(fcmRef.current.fcmToken);
        }
      })
      .catch((_error) => {
        //console.error(errorMessageFromUnkown(error));
      });
  }, []);

  useEffect(() => {
    if (fcmToken) {
      postFcmToken(fcmToken)
        .then((_r) => {
          //ignore
        })
        .catch((_err) => {
          //console.error(errorMessageFromUnkown(error));
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

  return (
    <Context.Provider value={{ fcmToken, getFcmToken, notificationMessages, chatMessages }}>
      {children}
    </Context.Provider>
  );
}
