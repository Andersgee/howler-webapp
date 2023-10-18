import { notFound } from "next/navigation";
import { apiRsc } from "#src/api/apiRsc";
import { FollowUserButton } from "#src/components/buttons/FollowUserButton";
import { MainShell } from "#src/components/MainShell";
import { UserImage } from "#src/components/UserImage";
import { idFromHashid } from "#src/utils/hashid";

export default async function Page({ params }: { params: { hashid: string } }) {
  const profileUserHashId = params.hashid;
  const profileUserId = idFromHashid(profileUserHashId);
  if (profileUserId === undefined) notFound();

  const { api, user } = await apiRsc();

  const profileUser = await api.user.infoPublic.fetch({ userId: profileUserId });
  if (!profileUser) notFound();

  const isFollowing = user ? await api.user.isFollowing.fetch({ userId: user.id }) : false;

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
