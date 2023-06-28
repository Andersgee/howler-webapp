"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "#src/utils/cn";
import { buttonVariants } from "../ui/Button";

type Props = ComponentProps<"a">;

const buttonStyles = buttonVariants({ variant: "outline" });

export function SignoutButton({ children, className, ...props }: Props) {
  const pathname = usePathname();

  return (
    <a href={`/api/auth/signout?route=${pathname}`} className={cn(buttonStyles, className)} {...props}>
      {children}
    </a>
  );
}
