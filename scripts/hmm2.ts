import "dotenv/config";

//import { jsonArrayFrom } from "kysely/helpers/mysql";
import { db } from "#src/db";

async function getList(eventId: number) {
  const followersFcmTokens = await db
    .selectFrom("FcmToken")
    .selectAll()
    .where("FcmToken.userId", "in", (eb) =>
      eb
        .selectFrom("Event as e")
        .innerJoin("UserUserPivot as u", "u.userId", "e.creatorId")
        .where("e.id", "=", eventId)
        .select("u.followerId")
    )
    .execute();
  console.log(followersFcmTokens);
}

getList(1);
