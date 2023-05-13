import { type NextRequest } from "next/server";
import {
  GITHUB_EMAILINFO,
  GITHUB_EMAILS_URL,
  GITHUB_TOKEN,
  GITHUB_TOKEN_URL,
  GITHUB_USERINFO,
  GITHUB_USERINFO_URL,
  USER_COOKIE_NAME,
  addUser,
  getUserByEmail,
} from "src/utils/auth";
import { encodeParams, getBaseUrl } from "src/utils/url";
import { createTokenFromUser, getSessionFromRequestCookie, verifyStateToken } from "src/utils/token";
import { db } from "src/db";
import { type TokenUser } from "src/utils/token/schema";

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

    // Exchange the code for an access token
    const token = GITHUB_TOKEN.parse(
      await fetch(GITHUB_TOKEN_URL, {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json", //ask for json (by default response is just a "search params string")
        },
        body: encodeParams({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: `${process.env.AUTH_CALLBACK_BASE_URL}/github`,
        }),
      }).then((res) => res.json())
    );

    // Obtain info about the user for which we now have an access token
    const userInfo = GITHUB_USERINFO.parse(
      await fetch(GITHUB_USERINFO_URL, {
        cache: "no-store",
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
        },
      }).then((res) => res.json())
    );

    //userInfo.email might not be public...
    //but we can fetch it from githubs users/email rest api
    if (!userInfo.email) {
      const emailInfo = GITHUB_EMAILINFO.parse(
        await fetch(GITHUB_EMAILS_URL, {
          headers: { Authorization: `${token.token_type} ${token.access_token}` },
        }).then((res) => res.json())
      );
      userInfo.email = (emailInfo.find((e) => e.primary) ?? emailInfo[0]).email;
    }

    //userInfo.name might not be set by user on their github profile, but userInfo.login is always there
    if (!userInfo.name) {
      userInfo.name = userInfo.login;
    }

    // Authenticate the user
    const existingUser = await getUserByEmail(userInfo.email);
    let tokenUser: TokenUser | undefined = undefined;

    if (existingUser) {
      if (!existingUser.githubUserId) {
        await db.updateTable("User").set({ githubUserId: userInfo.id }).where("id", "=", existingUser.id).execute();
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
        githubUserId: userInfo.id,
        image: userInfo.avatar_url,
      });

      tokenUser = {
        id: Number(insertResult.insertId),
        name: userInfo.name,
        image: userInfo.avatar_url,
      };
    }

    const userCookie = await createTokenFromUser(tokenUser);

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `${getBaseUrl()}${state.route}`,
        "Set-Cookie": `${USER_COOKIE_NAME}=${userCookie}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=2592000`,
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `${getBaseUrl()}`,
      },
    });
  }
}
