"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "#src/utils/cn";
import { IconArrowLeft, IconHowler } from "./Icons";
import { buttonVariants } from "./ui/Button";

const buttonStyles = buttonVariants({ variant: "secondary" });

export function HomeButton() {
  const pathname = usePathname();
  const [eventHashId, setEventHashId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const paths = pathname.split("/");

    if (paths.length === 4 && paths[1] === "event" && paths[3] === "chat") {
      const hashId = paths[2];
      setEventHashId(hashId);
    } else {
      setEventHashId(undefined);
    }
  }, [pathname]);

  if (eventHashId) {
    return (
      <Link href={`/event/${eventHashId}`} className={cn(buttonStyles, "h-12")}>
        <IconArrowLeft /> <span className="ml-2">Event</span>
      </Link>
    );
  }

  return (
    <Link href="/">
      <IconHowler clickable />
    </Link>
  );
}
