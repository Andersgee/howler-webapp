"use client";

import { format, formatDistance } from "date-fns";

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
