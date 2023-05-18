"use client";

import { addHours, startOfHour, subHours } from "date-fns";
import { useState } from "react";
import { IconArrowDown } from "src/icons/ArrowDown";
import { datetimelocalString } from "src/utils/date";

export function InputWhen() {
  const [dateWhen, setDateWhen] = useState(startOfHour(addHours(new Date(), 1)));
  const [dateWhenend, setDateWhenend] = useState(startOfHour(addHours(new Date(), 2)));

  return (
    <div className="flex flex-col items-center bg-white dark:bg-black">
      <input
        name="when"
        className="block bg-white px-2 py-1 dark:bg-black"
        type="datetime-local"
        value={datetimelocalString(dateWhen)}
        onChange={(e) => {
          if (!e.target.value) return;
          const d = new Date(e.target.value);
          setDateWhen(d);
          if (dateWhenend.getTime() <= d.getTime()) {
            setDateWhenend(addHours(d, 1));
          }
        }}
      />
      <IconArrowDown height={18} width={18} className="my-1" />
      <input
        name="whenend"
        className="block bg-white dark:bg-black"
        type="datetime-local"
        value={datetimelocalString(dateWhenend)}
        onChange={(e) => {
          if (!e.target.value) return;
          const d = new Date(e.target.value);
          setDateWhenend(d);

          if (dateWhen.getTime() >= d.getTime()) {
            setDateWhen(subHours(d, 1));
          }
        }}
      />

      <input type="hidden" name="tzminuteoffset" value={dateWhen.getTimezoneOffset()} />
    </div>
  );
}
