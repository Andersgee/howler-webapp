import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "__Host-session-csrf";

/*
https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

cookie prefixes are not technically needed but makes the browser assert some things about the cookie to even accept it.
"__Host-" is the strongest assertion. secure and domain locked.

not setting "Max-Age" or "Expires" makes it a session cookie aka deleted browser determines "session ends". 
(side note: the particula browser chooses when "session ends" and there might be session restoration going on)


*/

//using url.searchparams.append encodes space as plus instead of %20 among other things
function urlWithEncodedParams(url: string, params: Record<string, string>) {
  const u = new URL(url);
  u.search = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return u;
}

export async function GET(_req: NextRequest) {
  //this is the cross-site request forgery (CSRF) token. (aka anti-forgery state token)
  //purpose is to have something that exists on both client and server
  //so in basically this needs to be saved on server (or simply in the db) aswell.
  //you may or may not encode something useful in this token
  //TODO: random string here 30+ chars long
  //example here: https://developers.google.com/identity/openid-connect/openid-connect#createxsrftoken
  const token = "somesessiontokenhere";

  const url = urlWithEncodedParams(
    "https://accounts.google.com/o/oauth2/v2/auth",
    {
      client_id: "MYCLIENTID",
      response_type: "code",
      scope: "openid email profile",
    }
  );

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
