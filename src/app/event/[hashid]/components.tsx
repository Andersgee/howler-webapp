"use client";

import { format, formatDistance } from "date-fns";

function whenString(date: Date) {
  return `${format(date, "yyyy-MM-dd HH:mm")} (${formatDistance(date, Date.now(), {
    addSuffix: true,
  })})`;
}

type Props = {
  date: Date;
};

export function WhenText({ date }: Props) {
  //const str = `${format(date, "yyyy-MM-dd HH:mm")} (${formatDistance(date, Date.now(), {
  //  addSuffix: true,
  //})})`;

  return <>{whenString(date)}</>;
}
