import Link from "next/link";
import { db } from "src/db";
import { RSCUserprofile } from "./RSCUserprofile";
import { Userprofile } from "./Userprofile";

export const metadata = {
  title: "root page",
};

export default async function Home() {
  //const examples = await db.selectFrom("Example").selectAll().execute();
  const examples = await db
    .selectFrom("Example")
    .selectAll()
    .get({
      next: {
        revalidate: 10,
      },
    });

  const exampleMaybe = await db.selectFrom("Example").selectAll().getFirst();
  const example = await db.selectFrom("Example").selectAll().getFirstOrThrow();
  /*
  const insertResult = await db
    .insertInto("Example")
    .values({})
    .executeTakeFirst();
*/
  return (
    <main className="flex justify-center">
      <div>
        <div>
          <div className="">
            <Link href="/hmm" className="block px-3 py-2 bg-blue-300">
              GO TO HMM
            </Link>
          </div>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci ducimus a voluptate ipsum voluptatum enim
            eligendi rerum, maiores illo vel earum dolorum porro aperiam atque dicta esse illum, totam non.
          </p>
        </div>
        <RSCUserprofile />
        <Userprofile />
        <div>
          <h3>examples:</h3>
          {examples.map((example) => (
            <div key={example.id}>{JSON.stringify(example)}</div>
          ))}
        </div>
        <div>exampleMaybe: {JSON.stringify(exampleMaybe)}</div>
        <div>example: {JSON.stringify(example)}</div>
      </div>
    </main>
  );
}
