import { type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, USER_COOKIE_NAME } from "src/utils/constants";
import { encodeParams } from "src/utils/url";
import { createTokenFromUser } from "src/utils/token";
import { db } from "src/db";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const TOKEN_URL = "https://github.com/login/oauth/access_token";
const USERINFO_URL = "https://api.github.com/user";

type TokenData = {
  access_token: string;
  scope: string;
  token_type: string;
};

//has more properties
//see https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
type UserInfo = {
  id: number;
  login: string;
  name?: string;
  email?: string;
  avatar_url: string;
};

type EmailInfo = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: "public" | "private";
};

/**
 * this is where client is redirected after authorizing with github
 */
export async function GET(request: NextRequest) {
  try {
    const session_csrf = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    console.log("session_csrf", session_csrf);
    console.log("state", state);
    console.log("code", code);

    // Confirm the anti-forgery state token
    if (!code || !session_csrf || !state || session_csrf !== state) {
      return new Response(undefined, {
        status: 303,
        headers: {
          Location: `http://localhost:3000/nope`,
        },
      });
    }

    // Exchange the code for an access token

    const token_params = {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: "http://localhost:3000/api/auth/callback/github",
    };

    const tokenData = (await fetch(TOKEN_URL, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json", //ask for json (by default response is just a "search params string")
      },
      body: encodeParams(token_params),
    }).then((res) => res.json())) as TokenData;
    console.log("tokenData", tokenData);

    // Obtain info about the user for which we now have an access token
    const userInfo = (await fetch(USERINFO_URL, {
      cache: "no-store",
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    }).then((res) => res.json())) as UserInfo;
    console.log("userInfo:", userInfo);

    //userInfo.email might not be public...
    //but we can fetch it from githubs users/email rest api
    if (!userInfo.email) {
      const emailInfoList = (await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `${tokenData.token_type} ${tokenData.access_token}` },
      }).then((res) => res.json())) as EmailInfo[];
      console.log("emailInfoList:", emailInfoList);
      userInfo.email = (emailInfoList.find((e) => e.primary) ?? emailInfoList[0]).email;
    }

    //userInfo.name might not be set by user on their github profile, but userInfo.login is always there
    if (!userInfo.name) {
      userInfo.name = userInfo.login;
    }
    // Authenticate the user
    //maybe person already has an account
    const existingUser = await db
      .selectFrom("User")
      .selectAll()
      .where("User.email", "=", userInfo.email)
      .executeTakeFirst();
    let userId: number | undefined = undefined;
    if (existingUser) {
      console.log("a githubuser just signed in but already has User in db. its fine");
      userId = existingUser.id;
    } else {
      console.log("a githubuser just signed, creating new User in db ");
      const insertResult = await db
        .insertInto("User")
        .values({
          name: userInfo.name,
          email: userInfo.email,
          githubUserId: userInfo.id,
          image: userInfo.avatar_url,
        })
        .executeTakeFirst();
      userId = Number(insertResult.insertId);
    }

    const user_jwt = await createTokenFromUser({
      id: userId,
      name: userInfo.name,
      image: userInfo.avatar_url,
    });

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000`,
        "Set-Cookie": `${USER_COOKIE_NAME}=${user_jwt}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=2592000`,
      },
    });
  } catch (error) {
    console.log("ERROR IN api/auth/callback/github");
    console.log(error);
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000/nope`,
      },
    });
  }
}
