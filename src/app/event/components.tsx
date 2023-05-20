"use client";

import { useDialogDispatch } from "src/context/DialogContext";
import { IconHowler } from "src/icons/Howler";

export function HowlbuttonTriggerSignin() {
  const dialogDispatch = useDialogDispatch();
  return (
    <button
      onClick={() => dialogDispatch({ type: "show", name: "signin" })}
      type="button"
      className="flex w-40 items-center justify-center rounded-full border-2 border-black bg-blue-50 px-2 py-2 transition-colors hover:bg-blue-200"
    >
      <span className="mr-2 text-2xl text-black">Howl</span>
      <IconHowler />
    </button>
  );
}
