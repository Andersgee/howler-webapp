"use client";

import { addHours, startOfHour } from "date-fns";
import { useState } from "react";

type Precision = "m" | "s";

export function InputWhen() {
  const [dateWhen, setDateWhen] = useState(startOfHour(addHours(new Date(), 1)));

  return (
    <div className="">
      <input
        name="when"
        className="bg-white dark:bg-black"
        type="datetime-local"
        value={datetimelocalString(dateWhen)}
        onChange={(e) => {
          /*
            const d = e.target.valueAsDate;
          if (d) {
            setDateWhen(d);
          }
          */

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
