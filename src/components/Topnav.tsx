"use client";

import Link from "next/link";
import { useRef } from "react";
import { IconAvatar, IconBell, IconHowler, IconSettings } from "#src/components/Icons";
import { SigninButtons } from "#src/components/SigninButtons";
import { SignoutButton } from "#src/components/SignoutButton";
import { UserImage } from "#src/components/UserImage";
import { useDialogContext, useDialogDispatch } from "#src/context/DialogContext";
import { useUserContext } from "#src/context/UserContext";
import { useOnClickOutside } from "#src/hooks/useOnClickOutside";

export function Topnav() {
  return (
    <div className="flex justify-between">
      <Link href="/">
        <IconHowler className="m-2 h-8 w-8" />
      </Link>
      <div className="flex gap-2">
        {/*<NotificationsButton />*/}
        <ProfileButton />
      </div>
    </div>
  );
}

function ProfileButton() {
  const dialog = useDialogContext();
  const dialogDispatch = useDialogDispatch();
  const user = useUserContext();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => dialogDispatch({ type: "hide", name: "signin" }));

  return (
    <div ref={ref}>
      <button className="" onClick={() => dialogDispatch({ type: "toggle", name: "signin" })}>
        {user ? (
          <UserImage src={user.image} alt={user.name} />
        ) : (
          <IconAvatar className="hover:bg-accent h-12 w-12 rounded-full p-3" />
        )}
      </button>
      {dialog === "signin" && (
        <TopnavDialogShell>
          {user ? (
            <div>
              <div>
                signed in as{" "}
                <Link className="underline decoration-dotted" href="/profile">
                  {user.name}
                </Link>
              </div>
              <SignoutButton />
            </div>
          ) : (
            <SigninButtons />
          )}
        </TopnavDialogShell>
      )}
    </div>
  );
}

function NotificationsButton() {
  const user = useUserContext();
  const dialog = useDialogContext();
  const dialogDispatch = useDialogDispatch();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => dialogDispatch({ type: "hide", name: "notifications" }));

  if (!user) return null;
  return (
    <div ref={ref}>
      <button onClick={() => dialogDispatch({ type: "toggle", name: "notifications" })}>
        <IconBell className="hover:bg-accent h-12 w-12 rounded-full p-3" />
      </button>
      {dialog === "notifications" && (
        <TopnavDialogShell>
          <div>
            <div className="flex justify-between">
              <span>Settings</span>
              <Link href="/notifications">
                <IconSettings />
              </Link>
            </div>
            <hr />
            <div>list here</div>
          </div>
        </TopnavDialogShell>
      )}
    </div>
  );
}

function TopnavDialogShell({ children }: { children: React.ReactNode }) {
  return <div className="absolute right-0 top-12 z-10 border-2 bg-white p-4 shadow-md dark:bg-black">{children}</div>;
}
