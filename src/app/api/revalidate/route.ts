import { type NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");
  if (!tag || secret !== "SOME_REVALIDATE_SECRET") {
    return NextResponse.json({ revalidated: false, now: Date.now() });
  }

  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
