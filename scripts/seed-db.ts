import "dotenv/config";
import { db } from "#src/db";
import { randomWord } from "./lorem";

//put `"type": "module"` in package.json for this to work...

async function makeUser(i: number) {
  return db
    .insertInto("User")
    .values({
      name: `${randomWord()} ${randomWord()}`,
      email: `${randomWord()}@${randomWord()}.com`,
      image: `/seeduser/avatar${i}.svg`,
    })
    .executeTakeFirst();
}

async function seed() {
  //for (let i = 0; i < 3; i++) {
  //  const insertResult = await makeUser(i);
  //}

  for (let i = 0; i < 3; i++) {}
}

//const hmm = await db.selectFrom("User").selectAll().get();

seed();
