import Link from "next/link";
import { api } from "src/db";
import { db } from "src/db";
import { RSCUserprofile } from "./RSCUserprofile";
import { Userprofile } from "./Userprofile";

export const metadata = {
  title: "root page",
};

export default async function Home() {
  //const examples = await db.selectFrom("Example").selectAll().execute();
  const examples = await api.get(db.selectFrom("Example").selectAll(), {
    next: { revalidate: 10 },
  });

  //const examples = await api.post(db.selectFrom("Example").selectAll());

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
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci
            ducimus a voluptate ipsum voluptatum enim eligendi rerum, maiores
            illo vel earum dolorum porro aperiam atque dicta esse illum, totam
            non.
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
      </div>
    </main>
  );
}
