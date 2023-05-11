import { type NextRequest } from "next/server";
import {
  DISCORD_TOKEN,
  DISCORD_TOKEN_URL,
  DISCORD_USERINFO,
  DISCORD_USERINFO_URL,
  SESSION_COOKIE_NAME,
  USER_COOKIE_NAME,
  addUser,
  getUserByEmail,
} from "src/utils/auth";
import { encodeParams } from "src/utils/url";
import { createTokenFromUser } from "src/utils/token";

export const dynamic = "force-dynamic";
export const runtime = "edge";

//https://discord.com/developers/docs/topics/oauth2
//https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information
//https://discord.com/developers/docs/resources/user#user-object

export async function GET(request: NextRequest) {
  try {
    const session_csrf = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const state = request.nextUrl.searchParams.get("state");
    const code = request.nextUrl.searchParams.get("code");

    console.log("session_csrf", session_csrf);
    console.log("state", state);
    console.log("code", code);

    // Confirm csrf
    if (!code || !session_csrf || !state || session_csrf !== state) throw new Error("no session");

    // Exchange the code for an access token
    const token = DISCORD_TOKEN.parse(
      await fetch(DISCORD_TOKEN_URL, {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeParams({
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: "http://localhost:3000/api/auth/callback/discord",
        }),
      }).then((res) => res.json())
    );

    // Obtain info about the user for which we now have an access token
    const userInfo = DISCORD_USERINFO.parse(
      await fetch(DISCORD_USERINFO_URL, {
        cache: "no-store",
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
        },
      }).then((res) => res.json())
    );

    // we dont get an image url from discord, we get an "avatar" string which is just an image id.
    // get the image url instead which is at `https://cdn.discordapp.com/avatars/[user_id]/[user_avatar].png`
    // see https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints
    if (!userInfo.avatar) {
      const defaultAvatarNumber = parseInt(userInfo.discriminator) % 5;
      userInfo.avatar = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
    } else {
      const format = userInfo.avatar.startsWith("a_") ? "gif" : "png";
      userInfo.avatar = `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.${format}`;
    }

    // Authenticate the user
    const existingUser = await getUserByEmail(userInfo.email);
    let userId: number | undefined = undefined;
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const insertResult = await addUser({
        name: userInfo.username,
        email: userInfo.email,
        discordUserId: userInfo.id,
        image: userInfo.avatar,
      });
      userId = Number(insertResult.insertId);
    }

    const userCookie = await createTokenFromUser({
      id: userId,
      name: userInfo.username,
      image: userInfo.avatar,
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
