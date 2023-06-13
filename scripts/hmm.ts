import "dotenv/config";
import type { AnyColumn, SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/mysql";

import { db } from "#src/db";
import type { DB } from "#src/db/types";

//put `"type": "module"` in package.json for this to work...

async function getListOfFcmtokensForFollowersOfEventCreator(eventId: number) {
  const event = await db
    .selectFrom("Event")
    .selectAll("Event")
    .where("Event.id", "=", eventId)
    .select((b) => [
      jsonArrayFrom(
        b.selectFrom("UserUserPivot").select("followerId").whereRef("UserUserPivot.userId", "=", "Event.creatorId")
      ).as("creatorFollowers"),
    ])
    .executeTakeFirstOrThrow();

  const followerIds = event.creatorFollowers.map((follower) => follower.followerId);

  //this is the list I need
  const followersFcmTokens = await db
    .selectFrom("FcmToken")
    .selectAll()
    .where("FcmToken.userId", "in", followerIds)
    .execute();

  console.log(followersFcmTokens);

  return followersFcmTokens;
}

getListOfFcmtokensForFollowersOfEventCreator(1);
