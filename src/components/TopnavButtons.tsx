"use client";

import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "#src/components/ui/Popover";
import { useFcmContext } from "#src/context/Fcm";
import { type ChatMessageData } from "#src/context/Fcm/message-schema";
import { api } from "#src/hooks/api";
import { useStore } from "#src/store";
import { hashidFromId } from "#src/utils/hashid";
import type { TokenUser } from "#src/utils/token/schema";
import { SigninButtons } from "./buttons/SigninButtons";
import { SignoutButton } from "./buttons/SignoutButton";
import { EventWhatFromId } from "./EventWhatQuery";
import { IconArrowLink, IconBellWithNumber, IconChatWithNumber, IconSettings } from "./Icons";
import { Button } from "./ui/Button";
import { Separator } from "./ui/Separator";
import { UserImageClickable } from "./UserImage";

export function ProfileButton({ user }: { user: TokenUser }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={(x) => setOpen(x)}>
      <PopoverTrigger>
        <UserImageClickable src={user.image} alt={user.name} clickable />
      </PopoverTrigger>
      <PopoverContent className="">
        <div className="flex items-center justify-between">
          <h2>{user.name}</h2>
          <Link href="/account" onClick={() => setOpen(false)}>
            <IconSettings clickable />
          </Link>
        </div>

        <Separator />
        <div className="flex justify-end">
          <SignoutButton>sign out</SignoutButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function SigninButton() {
  const dialogValue = useStore.select.dialogValue();
  const dialogAction = useStore.select.dialogAction();

  return (
    <Popover open={dialogValue === "signin"} onOpenChange={() => dialogAction({ type: "toggle", name: "signin" })}>
      <PopoverTrigger asChild>
        <Button className="my-1">sign in</Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white">
        <SigninButtons />
      </PopoverContent>
    </Popover>
  );
}

export function NotificationsButton({ user }: { user: TokenUser }) {
  const { fcmToken, getFcmToken, notificationMessages } = useFcmContext();
  const notificationLatest10 = api.notification.latest10.useQuery();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={(x) => setOpen(x)}>
      <PopoverTrigger
        onClick={async () => {
          if (!fcmToken) {
            getFcmToken();
          }
        }}
      >
        <IconBellWithNumber number={notificationMessages.length} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center justify-between">
          <h2>Notifications</h2>
          <Link href="/account/notifications" onClick={() => setOpen(false)}>
            <IconSettings clickable />
          </Link>
        </div>
        <Separator />
        <ul>
          {notificationMessages.map((message) => (
            <li key={message.id}>
              <a className="hover:bg-secondary block border-b py-4 transition-colors" href={message.linkUrl}>
                <div className="flex items-center justify-between px-4">
                  <div>
                    <h3 className="capitalize-first shrink truncate text-base font-normal">{message.title}</h3>
                    <p>{message.body}</p>
                  </div>
                  <IconArrowLink className="text-neutral-500 dark:text-neutral-300" />
                </div>
              </a>
            </li>
          ))}

          {notificationLatest10.data
            ?.slice()
            .reverse()
            .map((notification) => (
              <li key={notification.id}>
                {/*<pre>{JSON.stringify(notification, null, 2)}</pre>*/}

                <Link
                  className="hover:bg-secondary block border-b py-4 transition-colors"
                  href={notification.relativeLinkUrl}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center justify-between px-4">
                    <div>
                      <h3 className="capitalize-first shrink truncate text-base font-normal">{notification.title}</h3>
                      <p>{notification.body}</p>
                    </div>
                    <IconArrowLink className="text-neutral-500 dark:text-neutral-300" />
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

/** returns a list of [eventId,messages] */
function groupChatMessagesByEventId(messages: ChatMessageData[]) {
  const groupedMessages: Map<number, ChatMessageData[]> = new Map();
  for (const message of messages) {
    //const a = groupedMessages[message.eventId]
    const eventMessages = groupedMessages.get(message.eventId);
    if (eventMessages) {
      eventMessages.push(message);
    } else {
      groupedMessages.set(message.eventId, [message]);
    }
  }

  return Array.from(groupedMessages);
}

/** returns a list of [eventId,messages] (ignores my own messages) */
function groupChatMessagesFromOthersByEventId(messages: ChatMessageData[], userId: number) {
  const groupedMessages: Map<number, ChatMessageData[]> = new Map();
  for (const message of messages) {
    if (message.userId === userId) continue;

    const eventMessages = groupedMessages.get(message.eventId);
    if (eventMessages) {
      eventMessages.push(message);
    } else {
      groupedMessages.set(message.eventId, [message]);
    }
  }

  return Array.from(groupedMessages);
}

/*
function useGroupedLatest10Chat(userId: number) {
  const { data } = api.notification.latest10chat.useQuery();
  const groupedMessagesList = useMemo(() => {
    if (!data) return [];
    const groupedMessages: Map<number, RouterOutputs["notification"]["latest10chat"]> = new Map();
    for (const message of data) {
      //if (message.userId === userId) continue;

      const eventMessages = groupedMessages.get(message.eventId);
      if (eventMessages) {
        eventMessages.push(message);
      } else {
        groupedMessages.set(message.eventId, [message]);
      }
    }

    return Array.from(groupedMessages);
  }, [data, userId]);

  return groupedMessagesList;
}
*/
export function ChatNotificationsButton({ user }: { user: TokenUser }) {
  const { fcmToken, getFcmToken, unseenChatMessages, clearChatNotifications } = useFcmContext();
  const { data: groupedLatest10Chat } = api.notification.latest10chat.useQuery();

  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={(x) => setOpen(x)}>
      <PopoverTrigger
        onClick={async () => {
          clearChatNotifications();
          if (!fcmToken) {
            getFcmToken();
          }
        }}
      >
        <IconChatWithNumber number={unseenChatMessages.length} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center justify-between">
          <h2>Messages</h2>
          <Link href="/account/notifications" onClick={() => setOpen(false)}>
            <IconSettings clickable />
          </Link>
        </div>
        <Separator />
        <ul>
          {groupedLatest10Chat?.map(({ eventId, messages }) => (
            <li key={eventId}>
              <Link
                className="hover:bg-secondary block border-b py-4 transition-colors"
                href={`/event/${hashidFromId(eventId)}/chat`}
              >
                <div className="flex items-center justify-between px-4">
                  <div>
                    <h3 className="capitalize-first shrink truncate text-base font-normal">
                      <EventWhatFromId eventId={eventId} />
                    </h3>
                    <p>{messages[0]?.text || ""}</p>
                    {messages.length > 1 && <p>{`...and ${messages.length > 9 ? "9+" : messages.length - 1} more`}</p>}
                  </div>
                  <IconArrowLink className="text-neutral-500 dark:text-neutral-300" />
                </div>
              </Link>
            </li>
          ))}
          {/*groupedChatMessages.map(([eventId, messages]) => (
            <li key={eventId}>
              <Link
                className="hover:bg-secondary block border-b py-4 transition-colors"
                href={`/event/${hashidFromId(eventId)}/chat`}
              >
                <div className="flex items-center justify-between px-4">
                  <div>
                    <h3 className="capitalize-first shrink truncate text-base font-normal">
                      <EventWhatFromId eventId={eventId} />
                    </h3>
                    <p>{messages[0].text}</p>
                    {messages.length > 1 && <p>{`...and ${messages.length - 1} more`}</p>}
                  </div>
                  <IconArrowLink className="text-neutral-500 dark:text-neutral-300" />
                </div>
              </Link>
            </li>
          ))*/}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
