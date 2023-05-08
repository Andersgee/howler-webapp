import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "src/utils/constants";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  return NextResponse.json({
    sessionCookieValue: sessionCookie || "nothing here",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  });
}
