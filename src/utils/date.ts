import { addMinutes, format, formatDistance } from "date-fns";
import { enUS } from "date-fns/locale";

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

export function formatDateSimple(d: Date) {
  return format(d, "yyyy-MM-dd HH:mm");
}

export function formatDate(date: Date, defaultLocale = true) {
  const datestr = format(date, "yyyy-MM-dd HH:mm", {
    locale: defaultLocale ? undefined : enUS,
  });
  const distancestr = formatDistance(date, Date.now(), {
    addSuffix: true,
    locale: defaultLocale ? undefined : enUS,
  });
  return `${datestr} (${distancestr})`;
}

export function prettyDate(date: Date, defaultLocale = true) {
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  if (defaultLocale) {
    //undefined to use browsers default locale
    return new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short", hour12: false }).format(date);
  } else {
    //"Saturday, June 17, 2023 at 20:55"
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      hour12: false,
      timeZone: "UTC",
      //timeZoneName: "short", //print timezone
    }).format(date);
  }

  //"Saturday, June 17, 2023 at 8:49 PM"
  //return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(date);
}

export function prettyDateShort(date: Date, defaultLocale = true) {
  if (defaultLocale) {
    //undefined to use browsers default locale
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short", hour12: false }).format(date);
  } else {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: false,
      timeZone: "UTC",
      //timeZoneName: "short", //print timezone
    }).format(date);
  }

  //"Saturday, June 17, 2023 at 8:49 PM"
  //return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(date);
}

/**
 * use on server side to parse the <input type"datetime-local"> value sent from form
 *
 * only for server components, if client component we can just send the date itself instead of a raw string
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
