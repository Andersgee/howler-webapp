"use client";

import { parse } from "devalue";
//import type { MessagePayload } from "firebase/messaging";
//import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api } from "#src/hooks/api";
import type { Optional } from "#src/utils/typescript";
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
  //chatMessages: ChatMessageData[];
  clearChatNotifications: () => void;
  unseenChatMessages: number;
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

/** returns a list of [eventId,messages] */
function groupChatMessagesByEventId(messages: ChatMessageData[]) {
  //const groupedMessages:{eventId:number,messages:ChatMessageData[]}[] = []

  const groupedMessages: Map<number, Omit<ChatMessageData, "type" | "title">[]> = new Map();
  for (const message of messages) {
    const newMessage = message as Optional<ChatMessageData, "type" | "title">;
    delete newMessage.type;
    delete newMessage.title;

    //const a = groupedMessages[message.eventId]
    const eventMessages = groupedMessages.get(newMessage.eventId);
    if (eventMessages) {
      eventMessages.push(newMessage);
    } else {
      groupedMessages.set(message.eventId, [newMessage]);
    }
  }

  //return Array.from(groupedMessages);
  return Array.from(groupedMessages).map((x) => ({ eventId: x[0], messages: x[1] }));
}

/** setup service worker and firebase cloud messaging */
export function FcmProvider({ children }: { children: React.ReactNode }) {
  const fcmRef = useRef<FirebaseCloudMessaging | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationMessages, setNotificationMessages] = useState<NotificationMessageData[]>([]);
  //const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([]);
  const [unseenChatMessages, setUnseenChatMessages] = useState(0);
  const apiContext = api.useContext();

  const clearChatNotifications = useCallback(() => {
    setUnseenChatMessages(0);
  }, []);

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
              setNotificationMessages((v) => [parsed.data, ...v]);
            }
          } else if (messageData.type === "chat") {
            const parsed = chatDataSchema.safeParse(messageData);
            if (parsed.success) {
              //setChatMessages((prev) => [...prev, parsed.data]);

              const newChatMessage = parsed.data as Optional<ChatMessageData, "type" | "title">;
              delete newChatMessage.type;
              delete newChatMessage.title;

              //1. update chat notifications
              apiContext.notification.latest10chat.setData(undefined, (prev) => {
                if (!prev) return prev;
                const data = structuredClone(prev); //dont mutate prev

                const existingPivot = data.find((x) => x.eventId === newChatMessage.eventId);
                if (existingPivot) {
                  existingPivot.messages.unshift(newChatMessage);
                } else {
                  data.unshift({
                    eventId: newChatMessage.eventId,
                    messages: [newChatMessage],
                  });
                }
                return data;
              });

              //2. update chat messages
              apiContext.eventchat.infiniteMessages.setInfiniteData({ eventId: newChatMessage.eventId }, (prev) => {
                if (!prev) return prev;
                const data = structuredClone(prev); //dont mutate prev
                data?.pages.at(-1)?.messages.unshift(newChatMessage);
                return data;
              });

              setUnseenChatMessages((prev) => prev + 1);
            }
          } else {
            console.log("ignoring pushmessage, payload.data: ", payload.data);
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
    <Context.Provider
      value={{ fcmToken, getFcmToken, notificationMessages, unseenChatMessages, clearChatNotifications }}
    >
      {children}
    </Context.Provider>
  );
}
