"use client";

import { startOfHour } from "date-fns";
import { useState } from "react";

type Precision = "m" | "s";

export function InputWhen() {
  const [dateWhen, setDateWhen] = useState(startOfHour(new Date()));

  return (
    <div className="relative flex w-64 justify-between bg-white dark:bg-black">
      <span className="absolute left-2 top-1 pr-1 text-neutral-400">When?</span>
      <input
        name="when"
        className="w-full bg-white py-1 pl-16 pr-1 dark:bg-black"
        type="datetime-local"
        value={datetimelocalString(dateWhen)}
        onChange={(e) => {
          if (e.target.value) {
            setDateWhen(new Date(e.target.value));
          }
        }}
      />
      <input type="hidden" name="tz" value={dateWhen.getTimezoneOffset()} />
    </div>
  );
}
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
function datetimelocalString(date: Date, p: Precision = "m") {
  //const n = p === "s" ? 19 : 16;
  const n = p === "s" ? 19 : 16;
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
