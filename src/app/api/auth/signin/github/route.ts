import { type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "src/utils/constants";
import { urlWithSearchparams } from "src/utils/url";

export const dynamic = "force-dynamic";
//export const runtime = "edge";

/*
https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow
*/

const AUTHORIZATION_URL = "https://github.com/login/oauth/authorize";

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
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: "http://localhost:3000/api/auth/callback/github",
    //login: "", //Suggests a specific account to use for signing in and authorizing the app.
    scope: "read:user user:email",
    state: session_csrf,
    //allow_signup: "false", //default is true, which allows a person to create an account aswell
  });

  return new Response(undefined, {
    status: 303,
    headers: {
      Location: authRequestUrl.toString(),
    },
  });
}
