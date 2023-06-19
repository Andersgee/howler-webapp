import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import { db } from "#src/db";
import {
  addUser,
  getUserByEmail,
  GOOGLE_discoveryDocument,
  GOOGLE_OPENID_DISCOVERY_URL,
  GOOGLE_TOKEN,
  GOOGLE_USERINFO,
  USER_COOKIE_MAXAGE,
  USER_COOKIE_NAME,
} from "#src/utils/auth";
import { tagUserInfo } from "#src/utils/tags";
import { createTokenFromUser, getSessionFromRequestCookie, verifyStateToken } from "#src/utils/token";
import { type TokenUser } from "#src/utils/token/schema";
import { absUrl, encodeParams } from "#src/utils/url";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequestCookie(request);
    if (!session) throw new Error("no session");

    const stateToken = request.nextUrl.searchParams.get("state");
    const code = request.nextUrl.searchParams.get("code");
    if (!stateToken || !code) throw new Error("no session");

    const state = await verifyStateToken(stateToken);
    if (!state) throw new Error("no session");

    // confirm csrf
    if (state.csrf !== session.csrf) throw new Error("no session");

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
          redirect_uri: absUrl("/api/auth/callback/google"),
          grant_type: "authorization_code",
        }),
      }).then((r) => r.json())
    );

    // Obtain user information from the ID token
    // regarding verifying id_token, see https://developers.google.com/identity/openid-connect/openid-connect#obtainuserinfo
    // TLDR; no need to validate since we used client_secret and response came directly from google
    // so just grab the payload part of the Base64-encoded object
    const userInfo = GOOGLE_USERINFO.parse(JSON.parse(Buffer.from(token.id_token.split(".")[1], "base64").toString()));
    //console.log("debug, api/google/callback, userInfo:", userInfo);

    // Authenticate the user

    const existingUser = await getUserByEmail(userInfo.email);
    //console.log("debug, api/google/callback, existingUser:", existingUser);

    let tokenUser: TokenUser | undefined = undefined;

    if (existingUser) {
      if (!existingUser.googleUserSub) {
        await db.updateTable("User").set({ googleUserSub: userInfo.sub }).where("id", "=", existingUser.id).execute();
      }

      tokenUser = {
        id: existingUser.id,
        name: existingUser.name,
        image: existingUser.image || "",
      };
    } else {
      const insertResult = await addUser({
        name: userInfo.name,
        email: userInfo.email,
        googleUserSub: userInfo.sub,
        image: userInfo.picture,
      });

      tokenUser = {
        id: Number(insertResult.insertId),
        name: userInfo.name,
        image: userInfo.picture,
      };
    }
    revalidateTag(tagUserInfo({ userId: tokenUser.id }));

    const userCookie = await createTokenFromUser(tokenUser);

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: absUrl(state.route),
        "Set-Cookie": `${USER_COOKIE_NAME}=${userCookie}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${USER_COOKIE_MAXAGE}`,
      },
    });
  } catch (error) {
    console.log(error);
    //const msg = error instanceof Error ? `${error.name}: ${error.message}` : "no error message";

    //might want to go to an error page and show the error
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: absUrl(),
      },
    });
  }
}
