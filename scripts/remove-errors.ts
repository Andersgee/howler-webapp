import "dotenv/config";
import { db } from "#src/db";

//put `"type": "module"` in package.json for this to work...

async function removeErrors() {
  const deleteResult = await db.deleteFrom("Error").where("id", ">", 0).execute();
  console.log(deleteResult);
}

removeErrors();
