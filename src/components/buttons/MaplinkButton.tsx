"use client";

import Link from "next/link";
import { buttonVariants } from "../ui/Button";

const buttonStyles = buttonVariants({ variant: "outline" });

export function MaplinkButton() {
  return (
    <Link href="/map" className={buttonStyles} prefetch={false}>
      Google maps test
    </Link>
  );
}
