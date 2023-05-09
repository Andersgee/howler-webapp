import { type NextRequest } from "next/server";
import {
  GOOGLE_OPENID_DISCOVERY_URL,
  SESSION_COOKIE_NAME,
  USER_COOKIE_NAME,
} from "src/utils/constants";
import { urlWithSearchparams } from "src/utils/url";
import { createTokenFromUser } from "src/utils/token";
import { db } from "src/db";

export const dynamic = "force-dynamic";
//export const runtime = "edge";

type GoogleIdToken = {
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

    // --- 3. Confirm the anti-forgery state token
    if (!code || !session_csrf || !state || session_csrf !== state) {
      return new Response(undefined, {
        status: 303,
        headers: {
          Location: `http://localhost:3000/nope`,
        },
      });
    }

    const discoveryDocument = (await fetch(GOOGLE_OPENID_DISCOVERY_URL, {
      cache: "default",
    }).then((res) => res.json())) as { token_endpoint: string };
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

    // --- 4. Exchange code for access token and ID token
    const tokenData = (await fetch(googleTokenRequestUrl, {
      cache: "no-store",
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

    // --- 5. Obtain user information from the ID token
    //
    // regarding validation of id_token, see https://developers.google.com/identity/openid-connect/openid-connect#obtainuserinfo
    //
    // " Normally, it is critical that you validate an ID token before you use it, but since
    //   you are communicating directly with Google over an intermediary-free HTTPS channel
    //   and using your client secret to authenticate yourself to Google, you can be confident
    //   that the token you receive really comes from Google and is valid. "

    //so just grab the payload part of the Base64-encoded JSON object
    const payload = JSON.parse(
      Buffer.from(tokenData.id_token.split(".")[1], "base64").toString()
    ) as GoogleIdToken;

    //actually I need to sign my own jwt also so might aswell use jwt lib here
    //unfortunately this route cant be runtime edge then right?
    //TODO: one option might be to just use crypto module for everything I do
    //const payload = jwt.decode(tokenData.id_token) as GoogleIdToken;

    // 6. Authenticate the user

    //maybe person already has an account
    const existingGoogleUser = await db
      .selectFrom("User")
      .selectAll()
      .where("User.googleUserSub", "=", payload.sub)
      .executeTakeFirst();
    let userId: number | undefined = undefined;
    if (existingGoogleUser) {
      console.log(
        "a googleuser just signed in but already has User in db. its fine"
      );
      userId = existingGoogleUser.id;
    } else {
      console.log("a googleuser just signed, creating new User in db ");
      const insertResult = await db
        .insertInto("User")
        .values({
          name: payload.name,
          email: payload.email,
          googleUserSub: payload.sub,
          image: payload.picture,
        })
        .executeTakeFirst();
      userId = Number(insertResult.insertId);
    }

    const user_jwt = createTokenFromUser({
      id: userId,
      name: payload.name,
      image: payload.picture,
    });

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000`,
        "Set-Cookie": `${USER_COOKIE_NAME}=${user_jwt}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=2592000`,
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
