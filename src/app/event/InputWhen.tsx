"use client";

import { addHours, startOfHour, subHours } from "date-fns";
import { useState } from "react";

export function InputWhen() {
  const [dateWhen, setDateWhen] = useState(startOfHour(addHours(new Date(), 1)));
  const [dateWhenend, setDateWhenend] = useState(startOfHour(addHours(new Date(), 2)));

  return (
    <div className="flex items-center bg-white dark:bg-black">
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

      <input type="hidden" name="tzminuteoffset" value={dateWhen.getTimezoneOffset()} />
    </div>
  );
}

/*
<span className="px-2">&#8212;</span>
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
      */

/**
 * `<input type="datetime-local">` wants a particular string format in local time such as
 *
 * "2021-12-15T20:15"
 *
 * or
 *
 * "2021-12-15T20:15:34"
 *
 * which is almost just date.toISOString() but not quite.
 */
function datetimelocalString(date: Date, precision: "minute" | "second" = "minute") {
  const n = precision === "second" ? 19 : 16;
  return localIsoString(date).slice(0, n);
}

function dateString(date: Date) {
  const n = 10;
  return localIsoString(date).slice(0, n);
}

function localIsoString(d: Date) {
  const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return date.toISOString();
}
