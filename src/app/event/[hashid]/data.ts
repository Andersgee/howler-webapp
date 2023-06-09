import { jsonObjectFrom } from "kysely/helpers/mysql";

import { db } from "#src/db";
//import { jsonArrayFrom } from "kysely/helpers/mysql";
import { idFromHashid } from "#src/utils/hashid";
import { tagHasJoinedEvent } from "#src/utils/tags";

export async function getEvent(eventHashid: string) {
  const eventId = idFromHashid(eventHashid);
  if (!eventId) return undefined;

  return db
    .selectFrom("Event")
    .selectAll("Event")
    .where("Event.id", "=", eventId)
    .select((eb) => [
      jsonObjectFrom(
        eb.selectFrom("User").select(["User.id", "User.name", "User.image"]).whereRef("User.id", "=", "Event.creatorId")
      ).as("creator"),
    ])
    .getFirst({
      cache: "force-cache",
      next: {
        tags: [`event-${eventHashid}`],
      },
    });
}

export async function getJoinedUserIds(eventHashid: string) {
  const eventId = idFromHashid(eventHashid);
  if (!eventId) return [];
  const userEventPivots = await db
    .selectFrom("UserEventPivot")
    .select("userId")
    .where("eventId", "=", eventId)
    .get({
      cache: "force-cache",
      next: {
        tags: [`event-joinedusers-${eventHashid}`],
      },
    });

  return userEventPivots.map((x) => x.userId);
}

export async function getHasJoinedEvent(eventHashid: string, userId: number) {
  const eventId = idFromHashid(eventHashid);
  if (!eventId) return false;
  const userEventPivot = await db
    .selectFrom("UserEventPivot")
    .select("userId")
    .where("userId", "=", userId)
    .where("eventId", "=", eventId)
    .getFirst({
      cache: "force-cache",
      next: {
        tags: [tagHasJoinedEvent({ eventId, userId })],
      },
    });

  if (userEventPivot) return true;
  return false;
}
