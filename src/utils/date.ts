export function datetimelocalString(date: Date, p: "m" | "s" = "m") {
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
