import { type NextRequest } from "next/server";
import {
  GOOGLE_OPENID_DISCOVERY_URL,
  GOOGLE_TOKEN,
  GOOGLE_USERINFO,
  GOOGLE_discoveryDocument,
  SESSION_COOKIE_NAME,
  USER_COOKIE_NAME,
  addUser,
  getUserByEmail,
} from "src/utils/auth";
import { encodeParams } from "src/utils/url";
import { createTokenFromUser } from "src/utils/token";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const session_csrf = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const state = request.nextUrl.searchParams.get("state");
    const code = request.nextUrl.searchParams.get("code");

    // confirm csrf
    if (!code || !session_csrf || !state || session_csrf !== state) throw new Error("no session");

    //const token_endpoint = "https://oauth2.googleapis.com/token";
    const token_endpoint = GOOGLE_discoveryDocument.parse(
      await fetch(GOOGLE_OPENID_DISCOVERY_URL, { cache: "default" }).then((r) => r.json())
    ).token_endpoint;

    // Exchange code for access token and ID token
    // https://developers.google.com/identity/openid-connect/openid-connect#exchangecode
    const token = GOOGLE_TOKEN.parse(
      await fetch(token_endpoint, {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeParams({
          code: code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: "http://localhost:3000/api/auth/callback/google",
          grant_type: "authorization_code",
        }),
      }).then((r) => r.json())
    );

    // Obtain user information from the ID token
    // regarding verifying id_token, see https://developers.google.com/identity/openid-connect/openid-connect#obtainuserinfo
    // TLDR; no need to validate since we used client_secret and response came directly from google
    // so just grab the payload part of the Base64-encoded object
    const userInfo = GOOGLE_USERINFO.parse(JSON.parse(Buffer.from(token.id_token.split(".")[1], "base64").toString()));

    // Authenticate the user
    const existingUser = await getUserByEmail(userInfo.email);
    let userId: number | undefined = undefined;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const insertResult = await addUser({
        name: userInfo.name,
        email: userInfo.email,
        googleUserSub: userInfo.sub,
        image: userInfo.picture,
      });
      userId = Number(insertResult.insertId);
    }

    const userCookie = await createTokenFromUser({
      id: userId,
      name: userInfo.name,
      image: userInfo.picture,
    });

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000`,
        "Set-Cookie": `${USER_COOKIE_NAME}=${userCookie}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=2592000`,
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000/nope`,
      },
    });
  }
}
