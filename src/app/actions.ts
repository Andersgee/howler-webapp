"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "#src/db";
import { utcDateFromDatetimelocalString } from "#src/utils/date";
import { protectedAction } from "#src/utils/formdata";
import { hashidFromId, idFromHashid } from "#src/utils/hashid";
import { tagEvents, tagHasJoinedEvent, tagIsFollowingUser } from "#src/utils/tags";
import { absUrl } from "#src/utils/url";

export const actionJoinOrLeaveEvent = protectedAction(
  z.object({
    eventhashid: z.string().min(1),
  }),
  async ({ data, user }) => {
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

    revalidateTag(tagHasJoinedEvent({ eventId, userId: user.id }));
  }
);

export const actionNotifyMeAboutEvent = protectedAction(
  z.object({
    eventhashid: z.string().min(1),
    fcmToken: z.string().min(1),
  }),
  async ({ data, user }) => {
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
  }
);

export const actionCreateEvent = protectedAction(
  z.object({
    what: z.string(),
    where: z.string(),
    when: z.string(),
    whenend: z.string(),
    who: z.string(),
    tzminuteoffset: z.coerce.number(),
  }),
  async ({ data, user }) => {
    const whenDate = utcDateFromDatetimelocalString(data.when, data.tzminuteoffset);
    const whenendDate = utcDateFromDatetimelocalString(data.whenend, data.tzminuteoffset);

    const insertresult = await db
      .insertInto("Event")
      .values({
        creatorId: user.id,
        what: data.what,
        where: data.where,
        when: whenDate,
        whenEnd: whenendDate,
        who: data.who,
        info: "no additional info added",
      })
      .executeTakeFirst();

    console.log("insertresult", insertresult);
    const insertId = Number(insertresult.insertId);
    const hashid = hashidFromId(insertId);
    revalidateTag(tagEvents());

    redirect(`/event/${hashid}`);
  }
);

export const followOrUnfollowUser = protectedAction(
  z.object({
    otherUserHashId: z.string().min(1),
  }),
  async ({ data, user }) => {
    const otherUserId = idFromHashid(data.otherUserHashId);
    if (!otherUserId) {
      console.log("no otherUserId");
      return null;
    }

    const deleteResult = await db
      .deleteFrom("Follow")
      .where("followerId", "=", user.id)
      .where("userId", "=", otherUserId)
      .executeTakeFirst();

    const numDeletedRows = Number(deleteResult.numDeletedRows);
    if (!numDeletedRows) {
      await db
        .insertInto("Follow")
        .values({
          followerId: user.id,
          userId: otherUserId,
        })
        .executeTakeFirst();
    }

    revalidateTag(tagIsFollowingUser({ myUserId: user.id, otherUserId: otherUserId }));
  }
);
