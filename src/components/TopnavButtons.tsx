"use client";

import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "#src/components/ui/Popover";
import { useDialogContext, useDialogDispatch } from "#src/context/DialogContext";
import { useNotificationsContext } from "#src/context/NotificationsContext";
import { api } from "#src/hooks/api";
import type { TokenUser } from "#src/utils/token/schema";
import { SigninButtons } from "./buttons/SigninButtons";
import { SignoutButton } from "./buttons/SignoutButton";
import { IconArrowLink, IconBellWithNumber, IconSettings } from "./Icons";
import { Button } from "./ui/Button";
import { Separator } from "./ui/Separator";
import { UserImage } from "./UserImage";

export function ProfileButton({ user }: { user: TokenUser }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={(x) => setOpen(x)}>
      <PopoverTrigger>
        <UserImage src={user.image} alt={user.name} clickable />
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
  const dialog = useDialogContext();
  const dialogDispatch = useDialogDispatch();

  //controlled popover, to trigger this from other places
  return (
    <Popover open={dialog === "signin"} onOpenChange={() => dialogDispatch({ type: "toggle", name: "signin" })}>
      <PopoverTrigger asChild>
        <Button className="my-1">sign in</Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white">
        <SigninButtons />
      </PopoverContent>
    </Popover>
  );
}

const alalala = [
  { title: 1, body: 2, linkUrl: 3, relativeLinkUrl: 4, fcmToken: 5 },
  "howl by Anders Gustafsson",
  "what: bek",
  "https://howler.andyfx.net/event/Xm7gm",
  "/event/Xm7gm",
  "eS_9SxTvUmgjvY1lylSA9k:APA91bF9puiyEvTdWkHGtowgIKSyVFgCHf1gcpY66207zEbcrVK3JnX1EhZwH245bDqMIXsOuSbpp89SwwXrorwvBxAAhE194Ze2At9jaDZVBH7mh1JNoGwZBcQ2wI9EENWAdC8014_U",
];

export function NotificationsButton({ user }: { user: TokenUser }) {
  const { fcmToken, getFcmToken, messages } = useNotificationsContext();
  const notificationLatest10 = api.notification.latest10.useQuery({ userId: user.id });
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
        <IconBellWithNumber number={messages.length} />
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
          {messages.map((message) => (
            <li key={message.messageId}>
              <a className="hover:bg-secondary block border-b py-4 transition-colors" href={message.fcmOptions?.link}>
                <div className="flex items-center justify-between px-4">
                  <div>
                    <h3 className="capitalize-first shrink truncate text-base font-normal">
                      {message.notification?.title || "title"}
                    </h3>
                    <p>{message.notification?.body || "body"}</p>
                  </div>
                  <IconArrowLink className="text-neutral-500 dark:text-neutral-300" />
                </div>
              </a>
            </li>
          ))}

          {notificationLatest10.data?.map((notification) => (
            <li key={notification.id}>
              {/*<pre>{JSON.stringify(notification, null, 2)}</pre>*/}

              <Link
                className="hover:bg-secondary block border-b py-4 transition-colors"
                href={notification.data.relativeLinkUrl}
              >
                <div className="flex items-center justify-between px-4">
                  <div>
                    <h3 className="capitalize-first shrink truncate text-base font-normal">
                      {notification.data.title}
                    </h3>
                    <p>{notification.data.body}</p>
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
