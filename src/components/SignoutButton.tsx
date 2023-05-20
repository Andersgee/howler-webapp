"use client";

import { usePathname } from "next/navigation";

export function SignoutButton() {
  const pathname = usePathname();

  return (
    <div className="mt-2">
      <a href={`/api/auth/signout?route=${pathname}`} className="underline decoration-dotted">
        sign out
      </a>
    </div>
  );
}
