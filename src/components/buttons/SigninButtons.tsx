"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconDiscord, IconGithub, IconGoogle } from "../Icons";

export function SigninButtons() {
  const pathname = usePathname();

  return (
    <div className="bg-white">
      <div>
        <a
          href={`/api/auth/signin/google?route=${pathname}`}
          className="mb-4 flex w-64 items-center justify-around bg-white p-3 font-medium text-black shadow-md transition duration-100 ease-out hover:bg-neutral-100 hover:ease-in focus:bg-neutral-200"
        >
          <IconGoogle />
          <span>Sign in with Google</span>
        </a>
      </div>
      <div>
        <a
          href={`/api/auth/signin/discord?route=${pathname}`}
          className="mb-4 flex w-64 items-center justify-around bg-white p-3 font-medium text-black shadow-md transition duration-100 ease-out hover:bg-neutral-100 hover:ease-in focus:bg-neutral-200"
        >
          <IconDiscord />
          <span>Sign in with Discord</span>
        </a>
      </div>
      <div>
        <a
          href={`/api/auth/signin/github?route=${pathname}`}
          className="mb-4 flex w-64 items-center justify-around bg-white p-3 font-medium text-black shadow-md transition duration-100 ease-out hover:bg-neutral-100 hover:ease-in focus:bg-neutral-200"
        >
          <IconGithub />
          <span>Sign in with Github</span>
        </a>
      </div>
      <p className="mt-3 w-64 text-center font-serif text-sm text-neutral-600 dark:text-neutral-600">
        By signing in, you agree to our <br />
        <Link
          className="text-neutral-600 underline decoration-solid hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500"
          href="/terms"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          className="text-neutral-600 underline decoration-solid hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500"
          href="/privacy"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}