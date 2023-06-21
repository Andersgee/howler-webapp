"use server";

import { revalidateTag } from "next/cache";
import { tagHasJoinedEvent } from "#src/utils/tags";

export async function revalidateHasJoinedEvent({ eventId, userId }: { eventId: number; userId: number }) {
  revalidateTag(tagHasJoinedEvent({ eventId, userId }));
}
