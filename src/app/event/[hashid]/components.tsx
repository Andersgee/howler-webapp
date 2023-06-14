"use client";

import { useEffect, useState } from "react";

import { useDialogDispatch } from "#src/context/DialogContext";
import { IconHowler } from "#src/icons/Howler";
import { formatDate } from "#src/utils/date";

type Props = {
  date: Date;
};

/**
 * avoids hydration mismatch of server/client rendered date string (by editing string on mount)
 */
function useFormatDate(date: Date) {
  const [value, setValue] = useState({ datestr: "---", isMounted: false });
  useEffect(() => {
    setValue({ datestr: formatDate(date), isMounted: true });
  }, [date]);
  return value;
}

export function WhenText({ date }: Props) {
  const { datestr, isMounted } = useFormatDate(date);
  return <span className={isMounted ? "visible" : "invisible"}>{datestr}</span>;
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
