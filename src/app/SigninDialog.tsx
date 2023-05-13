"use client";

import Link from "next/link";
import { useRef } from "react";
import { useDialogContext, useDialogDispatch } from "src/context/DialogContext";
import { useUser } from "src/context/UserContext";
import { useOnClickOutside } from "src/hooks/useOnClickOutside";
import { IconDiscord } from "src/icons/Discord";
import { IconGithub } from "src/icons/Github";
import { IconGoogle } from "src/icons/Google";

export function SignInDialog() {
  const dialog = useDialogContext();
  const dialogDispatch = useDialogDispatch();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => dialogDispatch({ type: "hide", name: "signin" }));
  const user = useUser();

  /*
  const { data: session } = useSession();
  useEffect(() => {
    if (showSignIn && session?.user) {
      dialogDispatch({ type: "hide", name: "signin" });
    }
  }, [session, showSignIn, dialogDispatch]);
*/
  //if (dialog === "signin") {
  if (true) {
    return (
      <div ref={ref} className="absolute right-0 top-0 z-10 border-2 bg-neutral-50 shadow-md p-4">
        {user ? <div>signed in as {user.name}</div> : <SigninButtons />}
      </div>
    );
  }
  return null;
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

/*

*/
