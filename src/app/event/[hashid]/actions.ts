"use server";

import { revalidateTag } from "next/cache";
import { db } from "src/db";
import { protectedAction } from "src/utils/formdata";
import { idFromHashid } from "src/utils/hashid";
import { hasJoinedEventTag } from "src/utils/tags";
import { absUrl } from "src/utils/url";
import { z } from "zod";

const schemaJoinOrLeaveEvent = z.object({
  eventhashid: z.string().min(1),
});

export const actionJoinOrLeaveEvent = protectedAction(schemaJoinOrLeaveEvent, async ({ data, user }) => {
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

const schemaNotifyMeAboutEvent = z.object({
  eventhashid: z.string().min(1),
  fcmToken: z.string().min(1),
});

export const actionNotifyMeAboutEvent = protectedAction(schemaNotifyMeAboutEvent, async ({ data, user }) => {
  const eventId = idFromHashid(data.eventhashid);
  if (!eventId) {
    console.log("no eventId");
    return null;
  }

  try {
    const url = `${process.env.DATABASE_HTTP_URL}/notify`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
      },
      body: JSON.stringify({
        userId: user.id,
        fcmToken: data.fcmToken,
        title: "some title",
        body: "some body",
        imageUrl: absUrl("/icons/favicon-48x48.png"),
        linkUrl: absUrl(`/event/${data.eventhashid}`),
      }),
    }).then((res) => res.json());
    console.log(r);
  } catch (error) {
    console.log(error);
  }

  console.log(
    `call /notify endpoint here with eventId: ${eventId} and userId: ${user.id} and fcmToken: ${data.fcmToken}`
  );

  return null;
});
