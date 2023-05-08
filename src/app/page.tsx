import Link from "next/link";
import { db } from "src/db";
import { getUserFromCookie } from "src/utils/token";

export const metadata = {
  title: "root page",
};

export default async function Home() {
  const user = getUserFromCookie();

  const examples = await db.selectFrom("Example").selectAll().execute();
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
        {user ? (
          <div>
            <h2>signed in as {user.name}</h2>
            <a href="/api/auth/signout" className="block px-3 py-2 bg-red-400">
              SIGN OUT
            </a>
          </div>
        ) : (
          <div>
            <h2>not signed in</h2>
            <a
              href="/api/auth/signin/google"
              className="block px-3 py-2 bg-green-400"
            >
              SIGN IN WITH GOOGLE
            </a>
          </div>
        )}
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
