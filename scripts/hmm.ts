import "dotenv/config";

import { db } from "#src/db";

//put `"type": "module"` in package.json for this to work...

async function createExample() {
  const insertResult = await db.insertInto("Example").executeTakeFirst();
  console.log("insertResult.insertId:", Number(insertResult.insertId));
  console.log("insertResult.numInsertedOrUpdatedRows:", Number(insertResult.numInsertedOrUpdatedRows));
}

async function getExamples() {
  const examples = await db.selectFrom("Example").selectAll().get();
  console.log("examples:", examples);
}

//createExample();
getExamples();
