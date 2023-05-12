import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "src/utils/auth";
import { createSessionToken, getSessionFromRequestCookie, getUserFromRequestCookie } from "src/utils/token";

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
  const user = await getUserFromRequestCookie(request);
  if (user) return NextResponse.json(user, { status: 200 });

  const session = await getSessionFromRequestCookie(request);
  if (session) return new Response(undefined, { status: 204 });

  const sessionToken = await createSessionToken();
  return new Response(undefined, {
    status: 204,
    headers: {
      "Set-Cookie": `${SESSION_COOKIE_NAME}=${sessionToken}; Path=/; Secure; HttpOnly; SameSite=Lax`,
    },
  });
}
