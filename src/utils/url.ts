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
  if (process.env.DOMAIN_URL) return `https://${process.env.DOMAIN_URL}`; //for server in production
  return `http://localhost:${process.env.PORT ?? 3000}`; // for server in development
}

/**
 * - for server environment: allow relative urls such as "/about", empty string (default) just returns baseUrl
 * - for client environment: then this just returns the string you gave it
 */
export function absUrl(url = "") {
  const baseUrl = getBaseUrl();
  if (url === "" || url === "/") return baseUrl;

  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  } else {
    return url;
  }
}
