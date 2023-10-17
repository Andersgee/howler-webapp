"use client";

import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "#src/components/ui/Popover";
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

export function NotificationsButton(_props: { user: TokenUser }) {
  const notificationMessages = useStore.select.fcmNotificationMessages();
  const [numberUnseen, setNumberUnseen] = useState(notificationMessages.length);
  const fcm = useStore.select.fcm();
  const notificationLatest10 = api.notification.latest10.useQuery();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={(x) => setOpen(x)}>
      <PopoverTrigger
        onClick={() => {
          fcm?.maybeRequestNotificationPermission();
          setNumberUnseen(0);
        }}
      >
        <IconBellWithNumber number={numberUnseen} />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className="flex items-center justify-between p-4">
          <h2>Notifications</h2>
          <Link href="/account/notifications" onClick={() => setOpen(false)}>
            <IconSettings clickable />
          </Link>
        </div>
        <ul>
          {notificationMessages.map((notification) => (
            <li key={notification.id}>
              <Link
                className="hover:bg-secondary block border-b py-4 transition-colors"
                href={notification.relativeLinkUrl}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center px-3">
                  <div>
                    <h3 className="capitalize-first shrink truncate text-base font-normal">{notification.title}</h3>
                    <p className="truncate">{notification.body}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}

          {notificationLatest10.data?.map((notification) => (
            <li key={notification.id}>
              {/*<pre>{JSON.stringify(notification, null, 2)}</pre>*/}

              <Link
                className="hover:bg-secondary block border-b py-4 transition-colors"
                href={notification.relativeLinkUrl}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center px-3">
                  <div>
                    <h3 className="capitalize-first shrink truncate text-base font-normal">{notification.title}</h3>
                    <p className="truncate">{notification.body}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function ChatNotificationsButton(_props: { user: TokenUser }) {
  const fcm = useStore.select.fcm();
  const unseenChatMessages = useStore.select.fcmUnseenChatMessages();
  const clearChatNotifications = useStore.select.fcmClearChatNotifications();
  const { data: groupedLatest10Chat } = api.notification.latest10chat.useQuery();

  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={(x) => setOpen(x)}>
      <PopoverTrigger
        onClick={async () => {
          clearChatNotifications();
          fcm?.maybeRequestNotificationPermission();
        }}
      >
        <IconChatWithNumber number={unseenChatMessages.length} />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className="flex items-center justify-between p-4">
          <h2>Messages</h2>
          <Link href="/account/notifications" onClick={() => setOpen(false)}>
            <IconSettings clickable />
          </Link>
        </div>
        {/*<Separator />*/}
        <ul>
          {groupedLatest10Chat?.map(({ eventId, messages }) => (
            <li key={eventId}>
              <Link
                className="hover:bg-secondary block border-t py-4 transition-colors"
                href={`/event/${hashidFromId(eventId)}/chat`}
              >
                <div className="flex items-center px-3">
                  <div>
                    <h3 className="capitalize-first shrink truncate text-base font-normal">
                      <EventWhatFromId eventId={eventId} />
                    </h3>
                    <p className="truncate">{messages[0]?.text || ""}</p>
                    {messages.length > 1 && <p>{`...and ${messages.length > 9 ? "9+" : messages.length - 1} more`}</p>}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
