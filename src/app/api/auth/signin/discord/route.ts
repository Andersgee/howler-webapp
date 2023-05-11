import { type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "src/utils/constants";
import { urlWithSearchparams } from "src/utils/url";

export const dynamic = "force-dynamic";
//export const runtime = "edge";

/*
https://discord.com/developers/docs/topics/oauth2

*/

//const AUTHORIZATION_URL = "https://discord.com/oauth2/authorize"; //is there a typo in their docs? they dont have "api" in the string
const AUTHORIZATION_URL = "https://discord.com/api/oauth2/authorize"; //this is what next-auth has hardcoded
const TOKEN_URL = "https://discord.com/api/oauth2/token";

//"https://discord.com/api/oauth2/authorize?scope=identify+email"

/*
example:
https://discord.com/oauth2/authorize
?response_type=code
&client_id=157730590492196864
&scope=identify%20guilds.join
&state=15773059ghq9183habn
&redirect_uri=https%3A%2F%2Fnicememe.website
&prompt=consent
*/

export async function GET(request: NextRequest) {
  const session_csrf = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!session_csrf) {
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000/nope`,
      },
    });
  }

  const authRequestUrl = urlWithSearchparams(AUTHORIZATION_URL, {
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
}
