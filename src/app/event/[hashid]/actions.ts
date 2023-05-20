"use server";

import { revalidateTag } from "next/cache";
import { db } from "src/db";
import { protectedAction } from "src/utils/formdata";
import { idFromHashid } from "src/utils/hashid";
import { hasJoinedEventTag } from "src/utils/tags";
import { z } from "zod";

const schema = z.object({
  eventhashid: z.string().min(1),
});

export const actionJoinOrLeaveEvent = protectedAction(schema, async ({ data, user }) => {
  const eventId = idFromHashid(data.eventhashid);
  if (!eventId) {
    console.log("no eventId");
    return null;
  }

  const deleteResult = await db
    .deleteFrom("UserEventPivot")
    .where("userId", "=", user.id)
    .where("eventId", "=", eventId)
    .executeTakeFirst();

  const numDeletedRows = Number(deleteResult.numDeletedRows);
  if (!numDeletedRows) {
    await db
      .insertInto("UserEventPivot")
      .values({
        eventId: eventId,
        userId: user.id,
      })
      .executeTakeFirst();
  }

  revalidateTag(hasJoinedEventTag({ eventId, userId: user.id }));
});
