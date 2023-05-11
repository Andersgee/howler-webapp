import { type NextRequest } from "next/server";
import { DISCORD_AUTHORIZATION_URL, SESSION_COOKIE_NAME } from "src/utils/auth";
import { urlWithSearchparams } from "src/utils/url";

export const dynamic = "force-dynamic";
export const runtime = "edge";

//https://discord.com/developers/docs/topics/oauth2

export async function GET(request: NextRequest) {
  try {
    const session_csrf = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!session_csrf) throw new Error("no session");

    const authRequestUrl = urlWithSearchparams(DISCORD_AUTHORIZATION_URL, {
      response_type: "code",
      client_id: process.env.DISCORD_CLIENT_ID,
      scope: "identify email",
      state: session_csrf,
      redirect_uri: "http://localhost:3000/api/auth/callback/discord",
      prompt: "consent",
    });

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: authRequestUrl.toString(),
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
