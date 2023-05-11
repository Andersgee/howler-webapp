import { getUserFromCookie } from "src/utils/token";
import { hashidFromId } from "src/utils/hashid";
import { db } from "src/db";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Page() {
  const tokenUser = await getUserFromCookie();
  if (!tokenUser) {
    return (
      <div>
        <div>you are not signed in</div>
        <a href="/api/auth/signin/google" className="block px-3 py-2 bg-green-400">
          SIGN IN WITH GOOGLE
        </a>
      </div>
    );
  }

  const user = await db
    .selectFrom("User")
    .select("User.id")
    .select("User.name")
    .select("User.image")
    .where("User.id", "=", tokenUser.id)
    .getFirst({
      cache: "no-store",
    });

  if (!user) {
    return <div>maybe return error or notfound instead</div>;
  }

  return (
    <main className="container flex justify-center">
      <div>
        <div className="flex items-center">
          <Image src={user.image || ""} alt={user.name} width={48} height={48} /> <h1 className="ml-2">{user.name}</h1>
        </div>
        <div>edit your profile here</div>
        <div>
          <a href={`/profile/${hashidFromId(user.id)}`} className="block px-3 py-2 bg-blue-500">
            also, view your public profile here
          </a>
        </div>
      </div>
    </main>
  );
}
