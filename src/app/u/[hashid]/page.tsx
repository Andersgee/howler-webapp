import { notFound } from "next/navigation";
import { FollowUserButton } from "#src/components/FollowUserButton";
import { UserImage } from "#src/components/UserImage";
import { idFromHashid } from "#src/utils/hashid";
import { getIsFollowingUser, getUserInfoPublic } from "#src/utils/tags";
import { getUserFromCookie } from "#src/utils/token";

export default async function Page({ params }: { params: { hashid: string } }) {
  const profileUserHashId = params.hashid;
  const profileUserId = idFromHashid(profileUserHashId);
  if (profileUserId === undefined) notFound();

  const profileUser = await getUserInfoPublic({ userId: profileUserId });
  if (!profileUser) notFound();

  const user = await getUserFromCookie();

  const isFollowing = user
    ? await getIsFollowingUser({ myUserId: user.id, otherUserHashId: profileUserHashId })
    : false;

  return (
    <main className="container flex justify-center">
      <div>
        <div className="flex items-center">
          <UserImage src={profileUser.image || ""} alt={profileUser.name} />
          <h1 className="ml-2">{profileUser.name}</h1>
        </div>
        <FollowUserButton userHashId={profileUserHashId} initialIsFollowing={isFollowing} />
      </div>
    </main>
  );
}
