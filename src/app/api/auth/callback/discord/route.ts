import { type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, USER_COOKIE_NAME } from "src/utils/constants";
import { encodeParams, urlWithSearchparams } from "src/utils/url";
import { createTokenFromUser } from "src/utils/token";
import { db } from "src/db";

export const dynamic = "force-dynamic";
//export const runtime = "edge";

//https://discord.com/developers/docs/topics/oauth2

//https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information
//https://discord.com/developers/docs/resources/user#user-object
type DiscordUserInfo = {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  discriminator: string;
};

const TOKEN_URL = "https://discord.com/api/oauth2/token";
const USERINFO_URL = "https://discord.com/api/users/@me";

type DiscordTokenData = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

/**
 * we dont get an image url from discord, we get an "avatar" string which is just an image id.
 * return the image url instead which is at `https://cdn.discordapp.com/avatars/[user_id]/[user_avatar].png`
 *
 * see https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints
 */
function imageUrlFromUserinfo(userInfo: DiscordUserInfo) {
  if (!userInfo.avatar) {
    const defaultAvatarNumber = parseInt(userInfo.discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
  }

  const format = userInfo.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.${format}`;
}

/**
 * this is where client is redirected after authorizing with discord
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
    const token_url_params = {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:3000/api/auth/callback/discord",
    };
    console.log("token_url_params", token_url_params);

    //const tokenRequestUrl = urlWithSearchparams(TOKEN_URL, token_url_params);

    //discord wants the params for the POST request in the body (not in the url)
    // Exchange the code for an access token
    const tokenData = (await fetch(TOKEN_URL, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: encodeParams(token_url_params),
    }).then((res) => res.json())) as DiscordTokenData;
    console.log("tokenData:", tokenData);

    // Obtain info about the user for which we now have an access token
    const userInfo = (await fetch(USERINFO_URL, {
      cache: "no-store",
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    }).then((res) => res.json())) as DiscordUserInfo;
    console.log("userInfo:", userInfo);
    const imageUrl = imageUrlFromUserinfo(userInfo);

    // Authenticate the user

    //maybe person already has an account
    const existingDiscordUser = await db
      .selectFrom("User")
      .selectAll()
      .where("User.discordUserId", "=", userInfo.id)
      .executeTakeFirst();
    let userId: number | undefined = undefined;
    if (existingDiscordUser) {
      console.log("a discorduser just signed in but already has User in db. its fine");
      userId = existingDiscordUser.id;
    } else {
      console.log("a discorduser just signed, creating new User in db ");
      const insertResult = await db
        .insertInto("User")
        .values({
          name: userInfo.username,
          email: userInfo.email || "",
          discordUserId: userInfo.id,
          image: imageUrl,
        })
        .executeTakeFirst();
      userId = Number(insertResult.insertId);
    }

    const user_jwt = createTokenFromUser({
      id: userId,
      name: userInfo.username,
      image: imageUrl,
    });

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000`,
        "Set-Cookie": `${USER_COOKIE_NAME}=${user_jwt}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=2592000`,
      },
    });
  } catch (error) {
    console.log("ERROR IN api/auth/callback/discord");
    console.log(error);
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000/nope`,
      },
    });
  }
}
