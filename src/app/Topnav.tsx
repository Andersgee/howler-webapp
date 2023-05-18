"use client";

import { ProfileButton } from "./ProfileButton";

export function Topnav() {
  return (
    <div className="flex justify-between">
      <div>left</div>
      <ProfileButton />
    </div>
  );
}
