"use client";

import { parse } from "devalue";
import { useEffect } from "react";
import {
  chatDataSchema,
  notificationDataSchema,
  type ChatMessageData,
  type FcmMessageData,
} from "#src/components/CloudMessaging/message-schema";
import { api } from "#src/hooks/api";
import { useStore } from "#src/store";
import { type Optional } from "#src/utils/typescript";

export function CloudMessaging() {
  const initFcm = useStore.select.initFcm();
  const payload = useStore.select.fcmLatestMessagePayload();
  const fcmAddNotificationMessage = useStore.select.fcmAddNotificationMessage();
  const fcmAddUnseenChatMessage = useStore.select.fcmAddUnseenChatMessage();
  const apiContext = api.useContext();

  useEffect(() => {
    initFcm();
  }, [initFcm]);

  useEffect(() => {
    if (!payload) return;
    const dataStr = payload.data?.str;
    if (!dataStr) return;

    //console.log("CloudMessaging effect triggered");

    const messageData = parse(dataStr) as FcmMessageData;

    if (messageData.type === "notification") {
      const parsed = notificationDataSchema.safeParse(messageData);
      if (parsed.success) {
        fcmAddNotificationMessage(parsed.data);
      }
    } else if (messageData.type === "chat") {
      const parsed = chatDataSchema.safeParse(messageData);
      if (parsed.success) {
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

        fcmAddUnseenChatMessage(newChatMessage);

        //2. update chat messages
        apiContext.eventchat.infiniteMessages.setInfiniteData({ eventId: newChatMessage.eventId }, (prev) => {
          if (!prev) return prev;
          const data = structuredClone(prev); //dont mutate prev
          data?.pages.at(-1)?.messages.unshift(newChatMessage);
          return data;
        });
      }
    } else {
      console.log("ignoring pushmessage, payload.data: ", payload.data);
    }
  }, [payload, fcmAddNotificationMessage, fcmAddUnseenChatMessage, apiContext]);
  return null;
}
