"use client";

import { IconHowler } from "#src/components/Icons";
import { useDialogDispatch } from "#src/context/DialogContext";

export function HowlbuttonTriggerSignin() {
  const dialogDispatch = useDialogDispatch();
  return (
    <button
      onClick={() => dialogDispatch({ type: "show", name: "signin" })}
      type="button"
      className="flex w-40 items-center justify-center rounded-full border-2 border-black bg-blue-50 p-2 transition-colors hover:bg-blue-200"
    >
      <span className="mr-2 text-2xl text-black">Howl</span>
      <IconHowler />
    </button>
  );
}
