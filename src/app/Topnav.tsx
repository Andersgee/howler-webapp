"use client";
import Link from "next/link";
import { useRef } from "react";
import { useDialogContext, useDialogDispatch } from "src/context/DialogContext";
import { useUser } from "src/context/UserContext";
import { useOnClickOutside } from "src/hooks/useOnClickOutside";
import { IconAvatar } from "src/icons/Avatar";
import { IconDiscord } from "src/icons/Discord";
import { IconGithub } from "src/icons/Github";
import { IconGoogle } from "src/icons/Google";
import { UserImage } from "src/sc/UserImage";

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
  const ref = useRef<HTMLButtonElement>(null);
  useOnClickOutside(ref, () => dialogDispatch({ type: "hide", name: "signin" }));
  const user = useUser();

  return (
    <button ref={ref} onClick={() => dialogDispatch({ type: "toggle", name: "signin" })}>
      {user ? <UserImage src={user.image} alt={user.name} /> : <IconAvatar className="h-8 w-8 m-2" />}
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
              <div className="mt-2">
                <a href="/api/auth/signout" className="underline decoration-dotted">
                  sign out
                </a>
              </div>
            </div>
          ) : (
            <SigninButtons />
          )}
        </div>
      )}
    </button>
  );
}

function SigninButtons() {
  return (
    <div>
      <div>
        <a
          href="/api/auth/signin/google"
          className="mb-4 flex w-64 items-center justify-around bg-white p-3 font-medium text-black shadow-md transition duration-100 ease-out hover:bg-neutral-100 hover:ease-in focus:bg-neutral-200"
        >
          <IconGoogle />
          <span>Sign in with Google</span>
        </a>
      </div>
      <div>
        <a
          href="/api/auth/signin/discord"
          className="mb-4 flex w-64 items-center justify-around bg-white p-3 font-medium text-black shadow-md transition duration-100 ease-out hover:bg-neutral-100 hover:ease-in focus:bg-neutral-200"
        >
          <IconDiscord />
          <span>Sign in with Discord</span>
        </a>
      </div>
      <div>
        <a
          href="/api/auth/signin/github"
          className="mb-4 flex w-64 items-center justify-around bg-white p-3 font-medium text-black shadow-md transition duration-100 ease-out hover:bg-neutral-100 hover:ease-in focus:bg-neutral-200"
        >
          <IconGithub />
          <span>Sign in with Github</span>
        </a>
      </div>
      <p className="mt-3 w-64 text-center font-serif text-sm text-neutral-600 dark:text-neutral-600">
        By signing in, you agree to our <br />
        <Link
          className="text-neutral-600 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500 underline decoration-dotted"
          href="/terms"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          className="text-neutral-600 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500 underline decoration-dotted"
          href="/privacy"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
