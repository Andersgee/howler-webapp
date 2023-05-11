import { type NextRequest } from "next/server";
import {
  GITHUB_EMAILINFO,
  GITHUB_EMAILS_URL,
  GITHUB_TOKEN,
  GITHUB_TOKEN_URL,
  GITHUB_USERINFO,
  GITHUB_USERINFO_URL,
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

    // Confirm csrf
    if (!code || !session_csrf || !state || session_csrf !== state) throw new Error("no session");

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
          redirect_uri: "http://localhost:3000/api/auth/callback/github",
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
    let userId: number | undefined = undefined;
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const insertResult = await addUser({
        name: userInfo.name,
        email: userInfo.email,
        githubUserId: userInfo.id,
        image: userInfo.avatar_url,
      });
      userId = Number(insertResult.insertId);
    }

    const userCookie = await createTokenFromUser({
      id: userId,
      name: userInfo.name,
      image: userInfo.avatar_url,
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
