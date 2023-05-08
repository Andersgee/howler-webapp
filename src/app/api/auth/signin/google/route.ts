import { type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "src/utils/constants";
import { urlWithSearchparams } from "src/utils/url";

export const dynamic = "force-dynamic";
export const runtime = "edge";

/*
https://developers.google.com/identity/openid-connect/openid-connect
https://developers.google.com/identity/openid-connect/openid-connect#server-flow

1. Create an anti-forgery state token (in api/session/route.ts)
2. Send an authentication request to Google (this file)
3. Confirm the anti-forgery state token (in api/callback/google/route.ts)
4. Exchange code for access token and ID token
5. Obtain user information from the ID token
6. Authenticate the user 
*/

export async function GET(request: NextRequest) {
  const session_csrf = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!session_csrf) {
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000/nope`,
      },
    });
  }

  //discoveryUrl should be hardcoded here. see https://developers.google.com/identity/openid-connect/openid-connect#discovery
  //field names must comply with: https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
  //but authorization_endpoint is the only thing we care about
  const discoveryUrl =
    "https://accounts.google.com/.well-known/openid-configuration";
  const discoveryDocument = (await fetch(discoveryUrl).then((res) =>
    res.json()
  )) as { authorization_endpoint: string };

  const baseUrl = discoveryDocument.authorization_endpoint;
  //const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth"; //will be this but important to keep in mind it might change

  //https://developers.google.com/identity/openid-connect/openid-connect#authenticationuriparameters
  const googleAuthRequestUrl = urlWithSearchparams(baseUrl, {
    client_id: process.env.GOOGLE_CLIENT_ID,
    response_type: "code",
    scope: "openid email profile",
    redirect_uri: "http://localhost:3000/api/auth/callback/google",
    state: session_csrf,
    nonce: crypto.randomUUID(),
  });

  return new Response(undefined, {
    status: 303,
    headers: {
      Location: googleAuthRequestUrl.toString(),
    },
  });
}
