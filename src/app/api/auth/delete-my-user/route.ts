import { type NextRequest } from "next/server";
import { db } from "#src/db";
import { USER_COOKIE_NAME } from "#src/utils/auth";
import { getUserFromRequestCookie } from "#src/utils/token";
import { absUrl } from "#src/utils/url";

export const dynamic = "force-dynamic";
export const runtime = "edge";

// remove cookies by setting a new cookie with same exact parameters but Max-Age 0
export async function GET(request: NextRequest) {
  try {
    //const route = request.nextUrl.searchParams.get("route") || "";

    const user = await getUserFromRequestCookie(request);
    if (!user) throw new Error("no user");

    const _deleteResult = await db.deleteFrom("User").where("id", "=", user.id).executeTakeFirst();

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: absUrl(),
        "Set-Cookie": `${USER_COOKIE_NAME}=null; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0`,
      },
    });
  } catch (error) {
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: absUrl(),
      },
    });
  }
}
