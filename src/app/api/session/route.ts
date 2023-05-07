import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "__Host-session";

/*
https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

cookie prefixes are not technically needed but makes the browser assert some things about the cookie to even accept it.
"__Host-" is the strongest assertion. secure and domain locked.

not setting "Max-Age" or "Expires" makes it a session cookie aka deleted browser determines "session ends". 
(side note: the particula browser chooses when "session ends" and there might be session restoration going on)


*/

export async function GET(_req: NextRequest) {
  const token = "somesessiontokenhere";

  return NextResponse.json(
    { message: "ok" },
    {
      status: 200,
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict`,
      },
    }
  );

  /*
  return NextResponse.json(
    { message: "ok" },
    {
      status: 200,
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=2592000`,
      },
    }
  );
  */
}
