import { type NextRequest } from "next/server";
import { DISCORD_AUTHORIZATION_URL } from "src/utils/auth";
import { createStateToken, getSessionFromRequestCookie } from "src/utils/token";
import { getBaseUrl, urlWithSearchparams } from "src/utils/url";

export const dynamic = "force-dynamic";
export const runtime = "edge";

//https://discord.com/developers/docs/topics/oauth2

export async function GET(request: NextRequest) {
  try {
    const route = request.nextUrl.searchParams.get("route") || "";
    const session = await getSessionFromRequestCookie(request);
    if (!session) throw new Error("no session");

    const stateToken = await createStateToken({ csrf: session.csrf, route });

    const authRequestUrl = urlWithSearchparams(DISCORD_AUTHORIZATION_URL, {
      response_type: "code",
      client_id: process.env.DISCORD_CLIENT_ID,
      scope: "identify email",
      state: stateToken,
      redirect_uri: `${process.env.AUTH_CALLBACK_BASE_URL}/discord`,
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
        Location: `${getBaseUrl()}`,
      },
    });
  }
}