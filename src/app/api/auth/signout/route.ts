import { type NextRequest } from "next/server";
import { USER_COOKIE_NAME } from "src/utils/constants";

export const dynamic = "force-dynamic";
export const runtime = "edge";

// remove cookies by setting a new cookie with same exact parameters but Max-Age 0
export function GET(_request: NextRequest) {
  return new Response(undefined, {
    status: 303,
    headers: {
      Location: `http://localhost:3000`,
      "Set-Cookie": `${USER_COOKIE_NAME}=null; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  });
}
