import "dotenv/config";
import { sql } from "kysely";

import { db } from "#src/db";

//put `"type": "module"` in package.json for this to work...

async function introspect() {
  const tables = await db.introspection.getTables();
  const schemas = await db.introspection.getSchemas();
  console.log("tables:", tables);
  console.log("schemas:", schemas);

  for (const table of tables) {
    //const describe = `DESCRIBE ${table.name}`;
    //const showIndexes = `SHOW INDEXES FROM ${table.name}`;

    // DESCRIBE User;
    // SHOW INDEXES FROM User;
    console.log(`\n\n\n-------- table: ${table.name} --------`);

    const describeResult = await sql`DESCRIBE ${sql.table(table.name)}`.execute(db);
    console.log(`DESCRIBE ${table.name};`);
    console.table(describeResult.rows);

    const showindexResult = await sql`SHOW INDEXES FROM ${sql.table(table.name)}`.execute(db);
    console.log(`SHOW INDEXES FROM ${table.name};`);
    console.table(showindexResult.rows);
  }
}

introspect();
