import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "__Host-yoyo";

//https://developers.google.com/identity/openid-connect/openid-connect

export async function POST(req: NextRequest) {
  try {
    //
    const token = "generate-some-signed-jwt-with-userid-email-and-image-here";
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
