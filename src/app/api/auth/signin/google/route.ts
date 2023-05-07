import { type NextRequest } from "next/server";
import { urlWithEncodedParams } from "./utils";
import { SESSION_COOKIE_NAME } from "src/utils/constants";

/*
https://developers.google.com/identity/openid-connect/openid-connect
https://developers.google.com/identity/openid-connect/openid-connect#server-flow

1. Create an anti-forgery state token
2. Send an authentication request to Google
3. Confirm the anti-forgery state token
4. Exchange code for access token and ID token
5. Obtain user information from the ID token
6. Authenticate the user 
*/

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionCookie) throw new Error("no session token");

    const url = urlWithEncodedParams(
      "https://accounts.google.com/o/oauth2/v2/auth",
      {
        client_id: "MYCLIENTID",
        response_type: "code",
        scope: "openid email profile",
        redirect_uri: "http://localhost/auth/callback/google",
        state: sessionCookie.value,
      }
    );

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000`,
      },
    });
  } catch (error) {
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000/nope`,
      },
    });
  }
}
