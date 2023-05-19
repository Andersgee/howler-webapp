"use client";

import { format, formatDistance } from "date-fns";
import { useDialogDispatch } from "src/context/DialogContext";
import { IconHowler } from "src/icons/Howler";

type Props = {
  date: Date;
};

export function WhenText({ date }: Props) {
  return (
    <>{`${format(date, "yyyy-MM-dd HH:mm")} (${formatDistance(date, Date.now(), {
      addSuffix: true,
    })})`}</>
  );
}

export function JoinbuttonTriggerSignin() {
  const dialogDispatch = useDialogDispatch();
  return (
    <button
      onClick={() => dialogDispatch({ type: "show", name: "signin" })}
      type="button"
      className="flex w-40 items-center justify-center rounded-full border-2 border-black bg-blue-50 px-2 py-2 transition-colors hover:bg-blue-200"
    >
      <span className="mr-2 text-2xl text-black">join</span>
      <IconHowler />
    </button>
  );
}
