"use server";

import { revalidateTag } from "next/cache";
import { tagHasJoinedEvent } from "#src/utils/tags";

//so in order to bust client side cache (without hard refresh), these revalidateTag calls must be in server actions
//invoke from client component with `startTransition(async () => await revalidateHasJoinedEvent({ eventId, userId }));`

export async function revalidateHasJoinedEvent({ eventId, userId }: { eventId: number; userId: number }) {
  revalidateTag(tagHasJoinedEvent({ eventId, userId }));
}
