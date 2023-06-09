import "dotenv/config";

import { db } from "../src/db";

//put `"type": "module"` in package.json for this to work...

const hmm = await db.selectFrom("User").selectAll().get();

console.log(hmm);
