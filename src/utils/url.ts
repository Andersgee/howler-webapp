/**
 * `new URL()` with encodeURIComponent() on searchParams
 */
export function urlWithSearchparams(url: string, params: Record<string, string | number | boolean>) {
  const u = new URL(url);
  u.search = encodeParams(params);
  return u;
}

/** for relative paths */
export function routeWithSearchparams(route: string, params: Record<string, string | number | boolean>) {
  return `${route}?${encodeParams(params)}`;
}

export function encodeParams(params: Record<string, string | number | boolean>) {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; //for server in production
  return `http://localhost:${process.env.PORT ?? 3000}`; // for server in development
}

/** allow relative urls such as "/about", empty string just returns baseurl */
export function absUrl(url: string) {
  const baseUrl = getBaseUrl();
  if (url === "" || url === "/") return baseUrl;

  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  } else {
    return url;
  }
}
