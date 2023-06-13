import "dotenv/config";
import type { AnyColumn, SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/mysql";

import { db } from "#src/db";
import type { DB } from "#src/db/types";

//put `"type": "module"` in package.json for this to work...

const b = 99;

async function getListOfFcmtokensForFollowersOfEventCreatorOld(eventId: number) {
  try {
    const event = await db
      .selectFrom("Event")
      .selectAll("Event")
      .where("Event.id", "=", eventId)
      .select((b) => [
        jsonArrayFrom(
          b
            .selectFrom("UserUserPivot")
            .select("UserUserPivot.followerId")
            .whereRef("UserUserPivot.followerId", "=", "Event.creatorId")
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

    console.log({ followersFcmTokens });
  } catch (error) {
    console.log(error);
  }
}
/*
async function findUserByEmail<T extends AnyColumn<DB, "User">[]>(email: string, fields: T) {
  return await db
    .selectFrom("User")
    .select<(typeof fields)[number]>(fields)
    .where("User.email", "=", email)
    .executeTakeFirst();
}

const user = findUserByEmail("hello", ["id", "googleUserSub"]);
*/

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

  return followersFcmTokens;
}
/*
async function getListOfFcmtokensForFollowersOfEventCreator3(eventId: number) {
  const event = await db
    .selectFrom("Event")
    .selectAll("Event")
    .where("Event.id", "=", eventId)
    .select((b) => [
      jsonArrayFrom(
        b
          .selectFrom("UserUserPivot")
          .select((c) => [
            "UserUserPivot.followerId"
            jsonArrayFrom(
              c.selectFrom("FcmToken")
              .select("FcmToken.userId")
              .whereRef("UserUserPivot.followerId","=","FcmToken.userId").as("hmmm")
              )
          ])
          .whereRef("UserUserPivot.userId", "=", "Event.creatorId")
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

  return followersFcmTokens;
}
*/
getListOfFcmtokensForFollowersOfEventCreator(1);

/*
async function createExample() {
  const insertResult = await db.insertInto("Example").values({ createdAt: new Date() }).executeTakeFirst();
  console.log("insertResult.insertId:", Number(insertResult.insertId));
  console.log("insertResult.numInsertedOrUpdatedRows:", Number(insertResult.numInsertedOrUpdatedRows));
}

async function getExamples() {
  const examples = await db.selectFrom("Example").selectAll().get();
  console.log("examples:", examples);
}

async function debugpost() {
  const data = await fetch(`${process.env.DATABASE_HTTP_URL}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
    },
    body: JSON.stringify({ yo: "wut" }),
  }).then((res) => res.json());
  console.log(data);
}

//createExample();
getExamples();
//debugpost();
*/
