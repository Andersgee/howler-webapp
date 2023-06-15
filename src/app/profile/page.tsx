import Link from "next/link";
import { notFound } from "next/navigation";

import { SigninButtons } from "#src/components/SigninButtons";
import { UserImageLarge } from "#src/components/UserImage";
import { db } from "#src/db";
import { hashidFromId } from "#src/utils/hashid";
import { tagUserInfo } from "#src/utils/tags";
import { getUserFromCookie } from "#src/utils/token";

export const dynamic = "force-dynamic";
export const runtime = "edge";

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
    .select(["id", "name", "image"])
    .where("User.id", "=", tokenUser.id)
    .getFirst({
      cache: "force-cache",
      next: {
        tags: [tagUserInfo({ userId: tokenUser.id })],
      },
    });

  if (!user) notFound();

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
