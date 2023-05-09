export const SESSION_COOKIE_NAME = "__Host-session-csrf";
export const USER_COOKIE_NAME = "__Host-user";

/**
 * should be hardcoded
 *
 * see https://developers.google.com/identity/openid-connect/openid-connect#discovery
 *
 * field names in returned json must comply with: https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
 *
 * but the only things we care about is `authorization_endpoint` and  `token_endpoint`
 * */
export const GOOGLE_OPENID_DISCOVERY_URL =
  "https://accounts.google.com/.well-known/openid-configuration";
