import { type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "#src/db";
import { getUserFromRequestCookie } from "#src/utils/token";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SCHEMA_REQUEST_BODY = z.object({
  fcmToken: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequestCookie(request);
    if (!user) {
      //return new Response(undefined, { status: 401 });
      return new Response(undefined, { status: 204 });
    }

    const { fcmToken } = SCHEMA_REQUEST_BODY.parse(await request.json());
    const _insertResult = await db
      .insertInto("FcmToken")
      .ignore() //ignore the insert if already exists
      .values({
        id: fcmToken,
        userId: user.id,
      })
      .executeTakeFirst();

    return new Response(undefined, { status: 200 });
  } catch (error) {
    return new Response(undefined, { status: 204 });
  }
}
