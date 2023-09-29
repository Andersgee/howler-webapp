import { type NextRequest } from "next/server";
import { z } from "zod";
import { getUploadCloudStoragSignedUrl } from "#src/utils/cloud-storage-url";
import { getUserFromRequestCookie } from "#src/utils/token";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SCHEMA_REQUEST_BODY = z.object({
  eventId: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const { eventId } = SCHEMA_REQUEST_BODY.parse(await request.json());
    const user = await getUserFromRequestCookie(request);
    if (!user) return new Response(undefined, { status: 401 });

    const signedUrl = await getUploadCloudStoragSignedUrl({ eventId, userId: user.id });
    if (!signedUrl) return new Response(undefined, { status: 500 });

    return new Response(signedUrl, { status: 200 });
  } catch (error) {
    return new Response(undefined, { status: 401 });
  }
}
