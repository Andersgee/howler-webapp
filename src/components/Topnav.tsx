"use client";

import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "#src/components/ui/Popover";
import { useUserContext } from "#src/context/UserContext";
import type { TokenUser } from "#src/utils/token/schema";
import { IconBell, IconHowler, IconSettings } from "./Icons";
import { SigninButtons } from "./SigninButtons";
import { SignoutLink } from "./SignoutLink";
import { Button } from "./ui/Button";
import { Separator } from "./ui/Separator";
import { UserImage } from "./UserImage";

export function Topnav() {
  const user = useUserContext();
  return (
    <div className="container">
      <div className="flex justify-between">
        <Link href="/">
          <IconHowler className="m-2 h-8 w-8" />
        </Link>
        {user ? (
          <div className="flex">
            <NotificationsButton />
            <ProfileButton user={user} />
          </div>
        ) : (
          <div>
            <SigninButton />
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfileButton({ user }: { user: TokenUser }) {
  return (
    <Popover>
      <PopoverTrigger>
        <UserImage src={user.image} alt={user.name} />
      </PopoverTrigger>
      <PopoverContent className="bg-white">
        <div>
          <p>
            signed in as{" "}
            <Link className="" href="/account">
              {user.name}
            </Link>
          </p>
          <Separator />
          <div className="flex justify-end">
            <SignoutLink>sign out</SignoutLink>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function SigninButton() {
  return (
    <Popover>
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
  return (
    <Popover>
      <PopoverTrigger>
        <IconBell clickable />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center justify-between">
          <h2>Notifications</h2>
          <Link href="/account/notifications">
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
