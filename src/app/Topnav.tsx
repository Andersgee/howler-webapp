"use client";

import Link from "next/link";
import { useRef } from "react";

import { SigninButtons } from "#src/components/SigninButtons";
import { SignoutButton } from "#src/components/SignoutButton";
import { UserImage } from "#src/components/UserImage";
import { useDialogContext, useDialogDispatch } from "#src/context/DialogContext";
import { useUserContext } from "#src/context/UserContext";
import { useOnClickOutside } from "#src/hooks/useOnClickOutside";
import { IconAvatar } from "#src/icons/Avatar";
import { IconHowler } from "#src/icons/Howler";

export function Topnav() {
  return (
    <div className="flex justify-between">
      <Link href="/">
        <IconHowler className="h-8 w-8 m-2" />
      </Link>
      <ProfileButton />
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
      <button onClick={() => dialogDispatch({ type: "toggle", name: "signin" })}>
        {user ? <UserImage src={user.image} alt={user.name} /> : <IconAvatar className="h-8 w-8 m-2" />}
      </button>
      {dialog === "signin" && (
        <div className="absolute right-0 top-12 z-10 border-2 shadow-md p-4">
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
        </div>
      )}
    </div>
  );
}
