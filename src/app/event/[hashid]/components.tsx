"use client";

import { useEffect, useState } from "react";

import { useDialogDispatch } from "#src/context/DialogContext";
import { IconHowler } from "#src/icons/Howler";
import { formatDate } from "#src/utils/date";

type Props = {
  date: Date;
};

/**
 * avoids hydration mismatch of date string (by changing date string in useEffect)
 * */
function useFormatDate(date: Date) {
  //const [datestr, setDatestr] = useState("");
  const [datestr, setDatestr] = useState(formatDate(date));
  useEffect(() => {
    setDatestr(formatDate(date));
  }, [date]);
  return datestr;
}

export function WhenText({ date }: Props) {
  const datestr = useFormatDate(date);
  return <>{datestr}</>;
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
