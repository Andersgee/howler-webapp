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
//const CACHED: RequestCache = "force-cache"; //default in nextjs
const CACHED = "force-cache";
const FRESH = "no-store"; //

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
