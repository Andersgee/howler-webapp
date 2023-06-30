"use client";

import { useEffect, useState } from "react";
import { formatDate } from "#src/utils/date";

type Props = {
  date: Date;
};

export function WhenText({ date }: Props) {
  const { datestr, isMounted } = useFormatDate(date);
  return <span>{datestr}</span>;
}

/**
 * avoids hydration mismatch of server/client rendered date string (by editing string on mount)
 */
function useFormatDate(date: Date) {
  const [value, setValue] = useState({ datestr: formatDate(date, false), isMounted: false });
  useEffect(() => {
    setValue({ datestr: formatDate(date), isMounted: true });
  }, [date]);
  return value;
}
