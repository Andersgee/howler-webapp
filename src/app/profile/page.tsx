import { getUserFromCookie } from "src/utils/token";
import { hashidFromId } from "src/utils/hashid";
import { db } from "src/db";
import { SigninButtons } from "src/sc/SigninButtons";
import Link from "next/link";
import { UserImageLarge } from "src/sc/UserImage";
import { userTag } from "src/utils/tags";

export const dynamic = "force-dynamic";

export default async function Page() {
  const tokenUser = await getUserFromCookie();
  if (!tokenUser) {
    return (
      <main className="container flex justify-center">
        <div>
          <h1 className="text-center">you are not signed in</h1>
          <SigninButtons />
        </div>
      </main>
    );
  }

  const user = await db
    .selectFrom("User")
    .select("User.id")
    .select("User.name")
    .select("User.image")
    .where("User.id", "=", tokenUser.id)
    .getFirst({
      cache: "force-cache",
      next: {
        tags: [userTag({ userId: tokenUser.id })],
      },
    });

  if (!user) {
    return <div>maybe return error or notfound instead</div>;
  }

  return (
    <main className="container flex justify-center">
      <div>
        <div className="flex items-center">
          <UserImageLarge src={user.image || ""} alt={user.name} /> <h1 className="ml-2">{user.name}</h1>
        </div>
        <div>Edit your profile information</div>
        <div>
          <Link href={`/profile/${hashidFromId(user.id)}`} className="block px-3 py-2 bg-blue-500">
            also, view your public profile here
          </Link>
        </div>
      </div>
    </main>
  );
}
