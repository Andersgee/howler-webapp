"use client";

import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "#src/components/ui/Popover";
import { useDialogContext, useDialogDispatch } from "#src/context/DialogContext";
import { useFcmContext } from "#src/context/Fcm";
import { api } from "#src/hooks/api";
import type { TokenUser } from "#src/utils/token/schema";
import { SigninButtons } from "./buttons/SigninButtons";
import { SignoutButton } from "./buttons/SignoutButton";
import { IconArrowLink, IconBellWithNumber, IconSettings } from "./Icons";
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
            <li key={message.title}>
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
