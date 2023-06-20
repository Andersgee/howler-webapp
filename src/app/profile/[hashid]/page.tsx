import Image from "next/image";
import { notFound } from "next/navigation";
import { FollowUserButton } from "#src/components/FollowUserButton";
import { idFromHashid } from "#src/utils/hashid";
import { getIsFollowingUser, getUserInfoPublic } from "#src/utils/tags";
import { getUserFromCookie } from "#src/utils/token";

//export const runtime = "edge";

export default async function Page({ params }: { params: { hashid: string } }) {
  const profileUserHashId = params.hashid;
  const profileUserId = idFromHashid(profileUserHashId);
  if (profileUserId === undefined) notFound();

  const profileUser = await getUserInfoPublic({ userId: profileUserId });
  if (!profileUser) notFound();

  const user = await getUserFromCookie();

  const isFollowing = user ? await getIsFollowingUser({ myUserId: user.id, otherUserId: profileUserId }) : false;

  return (
    <main className="container flex justify-center">
      <div>
        <div className="flex items-center">
          <Image src={profileUser.image || ""} alt={profileUser.name} width={48} height={48} />{" "}
          <h1 className="ml-2">{profileUser.name}</h1>
        </div>
        <div>public profile</div>
        <FollowUserButton userHashId={profileUserHashId} isFollowing={isFollowing} />
      </div>
    </main>
  );
}
