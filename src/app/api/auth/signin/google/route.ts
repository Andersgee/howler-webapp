import { type NextRequest, NextResponse } from "next/server";

/*
https://developers.google.com/identity/openid-connect/openid-connect
https://developers.google.com/identity/openid-connect/openid-connect#server-flow

1. Create an anti-forgery state token
2. Send an authentication request to Google
3. Confirm the anti-forgery state token
4. Exchange code for access token and ID token
5. Obtain user information from the ID token
6. Authenticate the user 
*/

export async function GET(req: NextRequest) {
  try {
    NextResponse.redirect("http://localhost:3000", { status: 303 });
    /*
    return NextResponse.json(
      { hello: "world" },
      {
        status: 200,
      }
    );
    */
  } catch (error) {
    return NextResponse.json(
      { hello: "world" },
      {
        status: 500,
      }
    );
  }
}
