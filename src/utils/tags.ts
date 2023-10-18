import { jsonObjectFrom } from "kysely/helpers/mysql";
import { db } from "#src/db";

/*
note to self:
nextjs is still working on caching behaviour for regular fetch() and things seems to change with updates?
"no-cache" used to work in next 13.4? aka getting fresh data AND updating cache
edit "no-cache" behaves the same way as "no-store" in nextjs. according to https://nextjs.org/docs/app/api-reference/functions/fetch#optionscache

- see https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching
- and https://developer.mozilla.org/en-US/docs/Web/API/Request/cache

tldr;
nextjs defaults to "force-cache" UNLESS dynamic function such as cookies() is used, in which case it will default to "no-store"

note to self: this might change yet again and might aswell always specify it.
Not sure how I love these "smart auto options" where default changes depending on usage of other functions

also: apparently trpc procedures must never return undefined,
so make sure getFirst() calls dont returns null instead of undefined undefined

*/
const CACHED: RequestCache = "force-cache"; //default in nextjs
const FRESH: RequestCache = "no-store"; //

type UserInfoParams = { userId: number };

export function tagUserInfo(p: UserInfoParams) {
  return `userinfo-${p.userId}`;
}
export async function getUserInfo(p: UserInfoParams, cached = true) {
  const data = await db
    .selectFrom("User")
    .selectAll()
    .where("User.id", "=", p.userId)
    .getFirst({
      cache: cached ? CACHED : FRESH,
      next: { tags: [tagUserInfo(p)] },
    });

  return data;
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
  const data = await db
    .selectFrom("EventLocation")
    .selectAll("EventLocation")
    .where("EventLocation.eventId", "=", p.eventId)
    .getFirst({
      cache: cached ? CACHED : FRESH,
      next: { tags: [tagEventLocation(p)] },
    });
  return data;
}

type EventInfoParams = { eventId: number };

export function tagEventInfo(p: EventInfoParams) {
  return `eventinfo-${p.eventId}`;
}
export async function getEventInfo(p: EventInfoParams, cached = true) {
  const data = await db
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
  return data;
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

export async function getUserInfoPublic(p: UserInfoParams, cached = true) {
  const data = await db
    .selectFrom("User")
    .select(["id", "name", "image"])
    .where("User.id", "=", p.userId)
    .getFirst({
      cache: cached ? CACHED : FRESH,
      next: { tags: [tagUserInfo(p)] },
    });

  return data;
}

type TileParams = { tileId: string };

export function tagTile(p: TileParams) {
  return `tile-${p.tileId}`;
}

export async function getTile(p: TileParams, cached = true) {
  const eventLocations = await db
    .selectFrom("EventLocationTilePivot")
    .where("EventLocationTilePivot.tileId", "=", p.tileId)
    .innerJoin("EventLocation", "EventLocation.id", "EventLocationTilePivot.eventLocationId")
    .innerJoin("Event", "EventLocation.eventId", "Event.id")
    .select([
      "Event.id",
      "Event.what",
      "Event.when",
      "EventLocation.placeName",
      "EventLocation.lng",
      "EventLocation.lat",
    ])
    .get({
      cache: cached ? CACHED : FRESH,
      next: { tags: [tagTile(p)] },
    });

  return eventLocations;
}
