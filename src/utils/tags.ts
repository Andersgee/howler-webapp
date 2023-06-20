import { jsonObjectFrom } from "kysely/helpers/mysql";
import { db } from "#src/db";
import { idFromHashid } from "./hashid";

/** userId follows otherUserId */
export function tagIsFollowingUser({ myUserId, otherUserId }: { myUserId: number; otherUserId: number }) {
  return `isfollowing-${myUserId}-${otherUserId}`;
}
export async function getIsFollowingUser({ myUserId, otherUserId }: { myUserId: number; otherUserId: number }) {
  const userUserPivot = await db
    .selectFrom("UserUserPivot")
    .select(["userId", "followerId"])
    .where("followerId", "=", myUserId)
    .where("userId", "=", otherUserId)
    .getFirst({
      cache: "force-cache",
      next: {
        tags: [tagIsFollowingUser({ myUserId, otherUserId })],
      },
    });

  if (userUserPivot) return true;
  return false;
}

export function tagHasJoinedEvent({ eventId, userId }: { eventId: number; userId: number }) {
  return `hasjoinedevent-${eventId}-${userId}`;
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

export function tagIsSubscribedToEvent({ eventId, userId }: { eventId: number; userId: number }) {
  return `issusbscribedtoevent-${eventId}-${userId}`;
}

export const tagEventInfo = ({ eventId }: { eventId: number }) => `event-${eventId}`;
export async function getEventInfo(eventHashid: string) {
  const eventId = idFromHashid(eventHashid);
  if (!eventId) return undefined;

  return await db
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
        tags: [tagEventInfo({ eventId })],
      },
    });
}

export const tagEvents = () => "events";
export async function getEventsLatest10() {
  return await db
    .selectFrom("Event")
    .selectAll()
    .select((eb) => [
      jsonObjectFrom(
        eb.selectFrom("User").select(["User.name", "User.image"]).whereRef("User.id", "=", "Event.creatorId")
      ).as("creator"),
    ])
    .orderBy("id", "desc")
    .offset(0)
    .limit(10)
    .get({
      cache: "force-cache",
      next: {
        tags: [tagEvents()],
      },
    });
}

export const tagUserInfo = ({ userId }: { userId: number }) => `userinfo-${userId}`;
export async function getUserInfo({ userId }: { userId: number }) {
  return await db
    .selectFrom("User")
    .selectAll()
    .where("User.id", "=", userId)
    .getFirst({
      cache: "force-cache",
      next: {
        tags: [tagUserInfo({ userId })],
      },
    });
}
export async function getUserInfoPublic({ userId }: { userId: number }) {
  return await db
    .selectFrom("User")
    .select(["id", "name", "image"])
    .where("User.id", "=", userId)
    .getFirst({
      cache: "force-cache",
      next: {
        tags: [tagUserInfo({ userId })],
      },
    });
}
