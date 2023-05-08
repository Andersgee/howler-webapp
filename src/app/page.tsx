import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "src/db";

export const metadata = {
  title: "root page",
};

export default async function Home() {
  const allCookies = cookies().getAll();
  const someEnvVar = process.env.NEXT_PUBLIC_HELLO;

  const examples = await db.selectFrom("Example").selectAll().execute();
  return (
    <main className="flex justify-center">
      <div>
        <div>
          <div className="">
            <div>someEnvVar: {someEnvVar}</div>
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
        <div>
          <h2>cookies:</h2>
          <p>{JSON.stringify(allCookies)}</p>
        </div>
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
