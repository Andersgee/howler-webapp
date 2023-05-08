/**
 * `new URL()` with encodeURIComponent() on searchParams
 */
export function urlWithSearchparams(
  url: string,
  params: Record<string, string>
) {
  const u = new URL(url);
  u.search = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  return u;
}
