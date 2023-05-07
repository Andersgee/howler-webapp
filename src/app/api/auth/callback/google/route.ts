import { type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, USER_COOKIE_NAME } from "src/utils/constants";
import { cookies } from "next/headers";

/**
 * this is where client is redirected after authorizing with google
 *
 * we are at step 3 of openid server flow
 * https://developers.google.com/identity/openid-connect/openid-connect#confirmxsrftoken
 * */
export async function GET(request: NextRequest) {
  try {
    console.log("api/auth/callback/google recieved GET request");

    console.log("request.url:", request.url);
    const allCookies = request.cookies.getAll();
    console.log("allCookies:", allCookies); //this is empty because request comes from google

    const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
    console.log("sessionCookie:", sessionCookie);

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
        "Set-Cookie": `${USER_COOKIE_NAME}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=2592000`,
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
