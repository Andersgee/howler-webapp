import { db } from "src/db";
import { jsonObjectFrom } from "kysely/helpers/mysql";
//import { jsonArrayFrom } from "kysely/helpers/mysql";
import { idFromHashid } from "src/utils/hashid";

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
        tags: [`event-${eventHashid}`, `event-${eventId}`],
      },
    });
}
