import Link from "next/link";
//import { db } from "src/db";
import { RSCUserprofile } from "./RSCUserprofile";
import { Userprofile } from "./Userprofile";
import { hashidFromId } from "src/utils/hashid";
import { IconGoogle } from "src/icons/Google";
import { IconGithub } from "src/icons/Github";
import { IconDiscord } from "src/icons/Discord";

export const metadata = {
  title: "root page",
};

export default async function Home() {
  //const examples = await db.selectFrom("Example").selectAll().execute();
  /*
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
  */
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
        {/* @ts-expect-error Async Server Component */}
        <RSCUserprofile />
        <Userprofile />

        <Link href={`/example/${hashidFromId(1)}`} className="block px-3 py-2 bg-blue-300">
          example 1
        </Link>
        <Link href={`/example/${hashidFromId(2)}`} className="block px-3 py-2 bg-blue-300">
          example 2
        </Link>
        <Link href={`/example/${hashidFromId(5)}`} className="block px-3 py-2 bg-blue-300">
          example 5
        </Link>
      </div>
      <div>
        <h2>Discord</h2>
        <IconDiscord />
      </div>

      <div>
        <h2>Github</h2>
        <IconGithub />
      </div>
      <div>
        <h2>Google</h2>
        <IconGoogle />
      </div>
    </main>
  );
}
