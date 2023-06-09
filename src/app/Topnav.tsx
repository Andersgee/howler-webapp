"use client";

import Link from "next/link";
import { useRef } from "react";

import { SigninButtons } from "#src/components/SigninButtons";
import { SignoutButton } from "#src/components/SignoutButton";
import { UserImage } from "#src/components/UserImage";
import { useDialogContext, useDialogDispatch } from "#src/context/DialogContext";
import { useUser } from "#src/context/UserContext";
import { useOnClickOutside } from "#src/hooks/useOnClickOutside";
import { IconAvatar } from "#src/icons/Avatar";

export function Topnav() {
  return (
    <div className="flex justify-between">
      <div></div>
      <ProfileButton />
    </div>
  );
}

function ProfileButton() {
  const dialog = useDialogContext();
  const dialogDispatch = useDialogDispatch();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => dialogDispatch({ type: "hide", name: "signin" }));
  const user = useUser();

  return (
    <div ref={ref}>
      <button onClick={() => dialogDispatch({ type: "toggle", name: "signin" })}>
        {user ? <UserImage src={user.image} alt={user.name} /> : <IconAvatar className="h-8 w-8 m-2" />}
      </button>
      {dialog === "signin" && (
        <div className="absolute right-0 top-12 z-10 border-2 bg-neutral-50 shadow-md p-4">
          {user ? (
            <div>
              <div>
                signed in as{" "}
                <Link className="underline decoration-dotted" href={`/profile`}>
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
