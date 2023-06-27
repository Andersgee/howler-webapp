"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "#src/utils/cn";
import { Button } from "./ui/Button";

type Props = ComponentProps<"a">;

export function SignoutLink({ children, className, ...props }: Props) {
  const pathname = usePathname();

  //<a href={`/api/auth/signout?route=${pathname}`} className={cn("underline decoration-dotted", className)} {...props}>
  return (
    <Button variant="secondary" asChild>
      <a href={`/api/auth/signout?route=${pathname}`} className={className} {...props}>
        {children}
      </a>
    </Button>
  );
}
