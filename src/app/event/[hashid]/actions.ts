"use server";

import { revalidateTag } from "next/cache";
import { db } from "src/db";
import { validateFormData } from "src/utils/formdata";
import { idFromHashid } from "src/utils/hashid";
import { getUserFromCookie } from "src/utils/token";

export async function joinOrLeaveEvent(formData: FormData) {
  const user = await getUserFromCookie();
  if (!user) {
    console.log("no user");
    return null;
  }

  const data = validateFormData(formData, ["eventhashid"]);
  if (!data) {
    console.log("no data");
    return null;
  }

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

  if (Number(deleteResult.numDeletedRows)) {
    //we just unjoined the user from the event
    //
    console.log("UN-joined user from event");
  } else {
    const insertResult = await db
      .insertInto("UserEventPivot")
      .values({
        eventId: eventId,
        userId: user.id,
      })
      .executeTakeFirst();

    console.log("user joined event");
  }

  revalidateTag(`event-joinedusers-${data.eventhashid}`);
}
