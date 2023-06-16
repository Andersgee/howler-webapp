import Image from "next/image";
import { notFound } from "next/navigation";

import { db } from "#src/db";
import { idFromHashid } from "#src/utils/hashid";
import { tagUserInfo } from "#src/utils/tags";

import { FollowUserButton } from "./FollowUserButton";

//export const runtime = "edge";

export default async function Page({ params }: { params: { hashid: string } }) {
  const userId = idFromHashid(params.hashid);
  if (userId === undefined) notFound();

  const user = await db
    .selectFrom("User")
    .select(["name", "image"])
    .where("User.id", "=", userId)
    .getFirst({
      next: {
        tags: [tagUserInfo({ userId })],
      },
    });
  if (!user) notFound();

  return (
    <main className="container flex justify-center">
      <div>
        <div className="flex items-center">
          <Image src={user.image || ""} alt={user.name} width={48} height={48} /> <h1 className="ml-2">{user.name}</h1>
        </div>
        <div>public profile</div>
        <FollowUserButton userId={userId} />
      </div>
    </main>
  );
}
