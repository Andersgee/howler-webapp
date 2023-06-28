"use client";

import Link from "next/link";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "#src/components/ui/Popover";
import { useDialogContext, useDialogDispatch } from "#src/context/DialogContext";
import type { TokenUser } from "#src/utils/token/schema";
import { SigninButtons } from "./buttons/SigninButtons";
import { SignoutButton } from "./buttons/SignoutButton";
import { IconBell, IconSettings } from "./Icons";
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

export function NotificationsButton() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={(x) => setOpen(x)}>
      <PopoverTrigger>
        <IconBell clickable />
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
          <li className="my-2">todo list of notifications here</li>
          <li className="my-2">todo list of notifications here</li>
          <li className="my-2">todo list of notifications here</li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
