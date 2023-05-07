import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "__Host-yoyo";

export async function GET(_req: NextRequest) {
  const token = "somedebugtokenfornow";

  return NextResponse.json(
    { hello: "world" },
    {
      status: 200,
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=2592000`,
      },
    }
  );
}
