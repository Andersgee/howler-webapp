import { jsonObjectFrom } from "kysely/helpers/mysql";
import { db } from "#src/db";

type IsFollowingUserParams = { myUserId: number; otherUserId: number };

export function tagIsFollowingUser(p: IsFollowingUserParams) {
  return `isfollowing-${p.myUserId}-${p.otherUserId}`;
}
export async function getIsFollowingUser(p: IsFollowingUserParams, cached = true) {
  const userUserPivot = await db
    .selectFrom("UserUserPivot")
    .select(["userId", "followerId"])
    .where("followerId", "=", p.myUserId)
    .where("userId", "=", p.otherUserId)
    .getFirst({
      cache: cached ? "force-cache" : "no-cache",
      next: {
        tags: [tagIsFollowingUser(p)],
      },
    });

  if (userUserPivot) return true;
  return false;
}

type HasJoinedEventParams = { eventId: number; userId: number };

export function tagHasJoinedEvent(p: HasJoinedEventParams) {
  return `hasjoinedevent-${p.eventId}-${p.userId}`;
}
export async function getHasJoinedEvent(p: HasJoinedEventParams, cached = true) {
  const userEventPivot = await db
    .selectFrom("UserEventPivot")
    .select("userId")
    .where("userId", "=", p.userId)
    .where("eventId", "=", p.eventId)
    .getFirst({
      cache: cached ? "force-cache" : "no-cache",
      next: {
        tags: [tagHasJoinedEvent(p)],
      },
    });

  if (userEventPivot) return true;
  return false;
}

type EventLocationParams = { eventId: number };

export function tagEventLocation(p: EventLocationParams) {
  return `eventlocation-${p.eventId}`;
}
export async function getEventLocation(p: EventLocationParams, cached = true) {
  return await db
    .selectFrom("EventLocation")
    .selectAll("EventLocation")
    .where("EventLocation.eventId", "=", p.eventId)
    .getFirst({
      cache: cached ? "force-cache" : "no-cache",
      next: { tags: [tagEventLocation(p)] },
    });
}

type EventInfoParams = { eventId: number };

export function tagEventInfo(p: EventInfoParams) {
  return `eventinfo-${p.eventId}`;
}
export async function getEventInfo(p: EventInfoParams, cached = true) {
  return await db
    .selectFrom("Event")
    .selectAll("Event")
    .where("Event.id", "=", p.eventId)
    .select((eb) => [
      jsonObjectFrom(
        eb.selectFrom("User").select(["User.id", "User.name", "User.image"]).whereRef("User.id", "=", "Event.creatorId")
      ).as("creator"),
    ])
    //.$if(true, (eb) =>
    //  eb.select((eb) => [
    //    jsonObjectFrom(
    //      eb
    //        .selectFrom("EventLocation")
    //        .select(["EventLocation.lng", "EventLocation.lat"])
    //        .whereRef("EventLocation.eventId", "=", "Event.id")
    //    ).as("location"),
    //  ])
    //)
    .getFirst({
      cache: cached ? "force-cache" : "no-cache",
      next: { tags: [tagEventInfo(p)] },
    });
}

export function tagEvents() {
  return "events";
}
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
    .limit(10)
    .get({
      next: { revalidate: 10 },
    });
}

type UserInfoParams = { userId: number };

export function tagUserInfo(p: UserInfoParams) {
  return `userinfo-${p.userId}`;
}
export async function getUserInfo(p: UserInfoParams, cached = true) {
  return await db
    .selectFrom("User")
    .selectAll()
    .where("User.id", "=", p.userId)
    .getFirst({
      cache: cached ? "force-cache" : "no-cache",
      next: { tags: [tagUserInfo(p)] },
    });
}
export async function getUserInfoPublic(p: UserInfoParams, cached = true) {
  return await db
    .selectFrom("User")
    .select(["id", "name", "image"])
    .where("User.id", "=", p.userId)
    .getFirst({
      cache: cached ? "force-cache" : "no-cache",
      next: { tags: [tagUserInfo(p)] },
    });
}
