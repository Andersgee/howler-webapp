import { jsonObjectFrom } from "kysely/helpers/mysql";
import { db } from "#src/db";

/*
note to self:
nextjs is still working on caching behaviour for regular fetch() and things seems to change with updates
"no-cache" used to work in next 13.4? aka getting fresh data AND updating cache

- see https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching
- and https://developer.mozilla.org/en-US/docs/Web/API/Request/cache

*/
const CACHED: RequestCache = "force-cache"; //default in nextjs
const FRESH: RequestCache = "no-store"; //

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
      cache: cached ? CACHED : FRESH,
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
      cache: cached ? CACHED : FRESH,
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
      cache: cached ? CACHED : FRESH,
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
    .getFirst({
      cache: cached ? CACHED : FRESH,
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
      cache: cached ? CACHED : FRESH,
      next: { tags: [tagUserInfo(p)] },
    });
}
export async function getUserInfoPublic(p: UserInfoParams, cached = true) {
  return await db
    .selectFrom("User")
    .select(["id", "name", "image"])
    .where("User.id", "=", p.userId)
    .getFirst({
      cache: cached ? CACHED : FRESH,
      next: { tags: [tagUserInfo(p)] },
    });
}

type TileParams = { tileId: string };

export function tagTile(p: TileParams) {
  return `tile-${p.tileId}`;
}

export async function getTile(p: TileParams, cached = true) {
  const eventLocations = await db
    .selectFrom("EventLocationTilePivot as p")
    .where("p.tileId", "=", p.tileId)
    .innerJoin("EventLocation", "EventLocation.id", "p.eventLocationId")
    .selectAll("EventLocation")
    .get({
      cache: cached ? CACHED : FRESH,
      next: { tags: [tagTile(p)] },
    });

  return eventLocations;
}
