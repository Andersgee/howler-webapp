import { type NextRequest } from "next/server";
import {
  GOOGLE_OPENID_DISCOVERY_URL,
  SESSION_COOKIE_NAME,
  USER_COOKIE_NAME,
} from "src/utils/constants";
import { urlWithSearchparams } from "src/utils/url";

export const dynamic = "force-dynamic";
//export const runtime = "edge";

/*
this is where client is redirected after authorizing with google

https://developers.google.com/identity/openid-connect/openid-connect
https://developers.google.com/identity/openid-connect/openid-connect#server-flow

1. Create an anti-forgery state token (in api/session/route.ts)
2. Send an authentication request to Google (in api/auth/signin/google/route.ts)
3. Confirm the anti-forgery state token (<-- YOU ARE HERE)
4. Exchange code for access token and ID token (<-- AND HERE)
5. Obtain user information from the ID token
6. Authenticate the user 
*/
export async function GET(request: NextRequest) {
  try {
    const session_csrf = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    // 3. Confirm the anti-forgery state token
    if (!code || !session_csrf || !state || session_csrf !== state) {
      return new Response(undefined, {
        status: 303,
        headers: {
          Location: `http://localhost:3000/nope`,
        },
      });
    }

    const discoveryDocument = (await fetch(GOOGLE_OPENID_DISCOVERY_URL).then(
      (res) => res.json()
    )) as { token_endpoint: string };
    const token_endpoint = discoveryDocument.token_endpoint;
    //const token_endpoint = "https://oauth2.googleapis.com/token";

    //see https://developers.google.com/identity/openid-connect/openid-connect#exchangecode
    const googleTokenRequestUrl = urlWithSearchparams(token_endpoint, {
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:3000/api/auth/callback/google",
      grant_type: "authorization_code",
    });

    // 4. Exchange code for access token and ID token
    const tokenData = (await fetch(googleTokenRequestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((res) => res.json())) as {
      id_token: string;
      access_token: string;
      expires_in: number;
      scope: string;
      token_type: string;
    };

    // regarding validation of id_token, see https://developers.google.com/identity/openid-connect/openid-connect#obtainuserinfo
    //
    // " Normally, it is critical that you validate an ID token before you use it, but since
    //   you are communicating directly with Google over an intermediary-free HTTPS channel
    //   and using your client secret to authenticate yourself to Google, you can be confident
    //   that the token you receive really comes from Google and is valid. "

    //so just grab the payload part of the Base64-encoded JSON object
    const stuff = JSON.parse(
      Buffer.from(tokenData.id_token.split(".")[1], "base64").toString()
    ) as {
      sub: string;
      name: string;
      email: string;
      picture: string;
      //iss: string;
      //azp: string;
      //aud: string;
      //email_verified: boolean;
      //at_hash: string;
      //nonce: string;
      //given_name: string;
      //family_name: string;
      //locale: string;
      //iat: number;
      //exp: number;
    };

    const kekeke = {
      iss: "https://accounts.google.com",
      azp: "632438944825-hg7akfj84miheai01avhug5ochrk2s1g.apps.googleusercontent.com",
      aud: "632438944825-hg7akfj84miheai01avhug5ochrk2s1g.apps.googleusercontent.com",
      sub: "117740985776559123826",
      email: "andersgee@gmail.com",
      email_verified: true,
      at_hash: "uhwa7owbfRhedYyDOHh6dw",
      nonce: "b6a49b72-863a-49ec-9df8-9dcbfcab5ac0",
      name: "Anders Gustafsson",
      picture:
        "https://lh3.googleusercontent.com/a/AGNmyxY_ZVI9PWR2YfP8oZRuNE3mr7kiXQ3xtSjbgLgcpA=s96-c",
      given_name: "Anders",
      family_name: "Gustafsson",
      locale: "en",
      iat: 1683566299,
      exp: 1683569899,
    };

    // should contain id_token
    // it also has access and refresh tokens for future request if needed
    console.log("tokenData:", tokenData);

    //console.log("request.url:", request.url);
    //console.log("sessionCookie:", session_csrf);

    //const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
    //console.log("sessionCookie:", sessionCookie);

    // that worked fine, we got this:
    // request.url: http://localhost:3000/api/auth/callback/google?state=somesessiontokenhere&code=4%2F0AbUR2VOE6OpPl3gjBfswhjBW9xuV_5AOrSNZptYTe5Ie4CTmAZUbQVJWoaBZh2zRQXiu1Q&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&authuser=0&prompt=consent

    //const data = await request.formData();
    //console.log("request.formData():", data);
    //const credential = data.get("credential"); //this is the idToken
    //const g_csrf_token = data.get("g_csrf_token");
    //const client_id = data.get("client_id");

    //return NextResponse.json({ credential: idToken, g_csrf_token, client_id });

    const token = "someusertokenhere";

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000`,
        "Set-Cookie": `${USER_COOKIE_NAME}=${token}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=2592000`,
      },
    });
  } catch (error) {
    console.log("ERROR IN api/auth/callback/google");
    console.log(error);
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000/nope`,
      },
    });
  }
}
