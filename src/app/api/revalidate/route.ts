import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");
  if (!tag || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, now: Date.now() });
  }

  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
