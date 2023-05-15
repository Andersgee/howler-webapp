"use client";

import { useDialogDispatch } from "src/context/DialogContext";
import { useUser } from "src/context/UserContext";
import { ProfileButton } from "./ProfileButton";

type Props = {
  className?: string;
};

export function Topnav({ className = "" }: Props) {
  const user = useUser();
  const dialogDistpatch = useDialogDispatch();
  return (
    <div className="flex justify-between">
      <div>left</div>
      <ProfileButton />
    </div>
  );
}
