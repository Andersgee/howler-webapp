import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "__Host-user";
// this is where user ends up after clicking sign in with google
// Its important to specify statuscode 303 for NextResponse.redirect
// https://github.com/vercel/next.js/issues/48204#issuecomment-1512495376
//
// more info: status 303 changes method to "GET" (default is status 307 which means keep the same method, in this case "POST")
// and any page such as "/" only responds to "GET" requests

export async function GET(request: NextRequest) {
  try {
    console.log("api/auth/callback/google recieved GET request");
    console.log("request.url:", request.url);

    // that worked fine, we got this:
    // request.url: http://localhost:3000/api/auth/callback/google?state=somesessiontokenhere&code=4%2F0AbUR2VOE6OpPl3gjBfswhjBW9xuV_5AOrSNZptYTe5Ie4CTmAZUbQVJWoaBZh2zRQXiu1Q&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&authuser=0&prompt=consent

    //const data = await request.formData();
    //console.log("request.formData():", data);
    //const credential = data.get("credential"); //this is the idToken
    //const g_csrf_token = data.get("g_csrf_token");
    //const client_id = data.get("client_id");

    //return NextResponse.json({ credential: idToken, g_csrf_token, client_id });

    const token = "someusertokenhere";

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000`,
        "Set-Cookie": `${COOKIE_NAME}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=2592000`,
      },
    });
  } catch (error) {
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000/nope`,
      },
    });
  }
}
