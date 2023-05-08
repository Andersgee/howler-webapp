import { type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "src/utils/constants";

export const dynamic = "force-dynamic";
export const runtime = "edge";

/*
https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

cookie prefixes are not technically needed but makes the browser assert some things about the cookie to even accept it.
"__Host-" is the strongest assertion. secure and domain locked.

not setting "Max-Age" or "Expires" makes it a session cookie aka deleted browser determines "session ends". 
(side note: the particula browser chooses when "session ends" and there might be session restoration going on)

doesnt really matter but probably status 204 (no content) is be the proper code here
*/

export async function GET(request: NextRequest) {
  const alreadyHasSession = request.cookies.has(SESSION_COOKIE_NAME);
  if (alreadyHasSession) {
    return new Response(undefined, { status: 204 });
  }

  //this is the cross-site request forgery (CSRF) token. (aka anti-forgery state token)
  //purpose is to have something that exists on both client and server
  //so basically this needs to be saved on server (or simply in the db) aswell.
  //you may or may not encode something useful in this token
  //TODO: random string here 30+ chars long
  //example here: https://developers.google.com/identity/openid-connect/openid-connect#createxsrftoken
  const session_csrf = crypto.randomUUID();

  return new Response(undefined, {
    status: 204,
    headers: {
      "Set-Cookie": `${SESSION_COOKIE_NAME}=${session_csrf}; Path=/; Secure; HttpOnly; SameSite=Lax`,
    },
  });
}
