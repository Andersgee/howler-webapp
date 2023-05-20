import { addMinutes, format } from "date-fns";

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
export function datetimelocalString(date: Date, p: "m" | "s" = "m") {
  //const n = p === "s" ? 19 : 16;
  const n = p === "s" ? 19 : 16;
  return localIsoString(date).slice(0, n);
}

function localIsoString(d: Date) {
  const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return date.toISOString();
}

export function formatDate(d: Date) {
  return format(d, "yyyy-MM-dd HH:mm");
}

/**
 * use on server side to parse the <input type"datetime-local"> value send from form
 *
 * note to self:
 * the datetime-local string we get from form is in the users local time (without any timezone info)
 * we use the users timeone offset aswell to be able to determine what universal datetime it actually is
 */
export function utcDateFromDatetimelocalString(localIsoStringDate: string, tzminuteoffset: number) {
  const d = new Date(localIsoStringDate);
  const utcDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()));

  return addMinutes(utcDate, tzminuteoffset);
}
