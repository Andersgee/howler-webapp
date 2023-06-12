import "dotenv/config";

import { db } from "#src/db";

//put `"type": "module"` in package.json for this to work...

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
