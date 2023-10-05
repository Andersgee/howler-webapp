import { notFound } from "next/navigation";
import { FollowUserButton } from "#src/components/buttons/FollowUserButton";
import { MainShell } from "#src/components/MainShell";
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

  const isFollowing = user ? await getIsFollowingUser({ myUserId: user.id, otherUserId: profileUserId }) : false;

  return (
    <MainShell>
      <div className="flex items-center">
        <UserImage src={profileUser.image || ""} alt={profileUser.name} />
        <h1 className="ml-2">{profileUser.name}</h1>
      </div>
      <FollowUserButton userId={profileUserId} initialIsFollowing={isFollowing} />
    </MainShell>
  );
}
