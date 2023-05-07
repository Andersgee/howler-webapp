import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "__Host-user";
// this is where user ends up after clicking sign in with google
// Its important to specify statuscode 303 for NextResponse.redirect
// https://github.com/vercel/next.js/issues/48204#issuecomment-1512495376
//
// more info: status 303 changes method to "GET" (default is status 307 which means keep the same method, in this case "POST")
// and any page such as "/" only responds to "GET" requests

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    console.log("request.formData():", data);
    const credential = data.get("credential"); //this is the idToken
    //const g_csrf_token = data.get("g_csrf_token");
    //const client_id = data.get("client_id");

    //return NextResponse.json({ credential: idToken, g_csrf_token, client_id });

    const token = "someusertokenhere";
    //setting the cookie here and redirecting will not give the request the cookie right away..
    //so pass ?signin=true or something and router.reload if its there. yay
    return NextResponse.redirect("http://localhost:3000", {
      status: 303,
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=2592000`,
        "x-myresponseheader": "somevalb",
      },
    });
  } catch (error) {
    return NextResponse.redirect("http://localhost:3000/nope", { status: 303 });
  }
}
