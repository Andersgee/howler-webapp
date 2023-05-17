import { NextResponse, type NextRequest } from "next/server";
import { db } from "src/db";
import { idFromHashid } from "src/utils/hashid";
import { getUserFromRequestCookie } from "src/utils/token";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const eventHashid = request.nextUrl.searchParams.get("event");
    if (!eventHashid) throw new Error("bad request");

    const eventId = idFromHashid(eventHashid);
    const user = await getUserFromRequestCookie(request);
    if (!user || !eventId) throw new Error("bad request");

    const userEventPivot = await db
      .selectFrom("UserEventPivot")
      .selectAll()
      .where("eventId", "=", eventId)
      .where("userId", "=", user.id)
      .executeTakeFirstOrThrow();
    NextResponse.json({ isjoined: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isjoined: false }, { status: 200 });
  }
}
