import { followOrUnfollowUser } from "#src/app/actions";
import { db } from "#src/db";
import { hashidFromId } from "#src/utils/hashid";
import { tagIsFollowingUser } from "#src/utils/tags";
import { getUserFromCookie } from "#src/utils/token";

type Props = {
  userId: number;
};

export async function FollowUserButton({ userId }: Props) {
  const tokenUser = await getUserFromCookie();
  if (!tokenUser || tokenUser.id === userId) return null;

  const existingFollow = await db
    .selectFrom("Follow")
    .select(["userId", "followerId"])
    .where("followerId", "=", tokenUser.id)
    .where("userId", "=", userId)
    .getFirst({
      cache: "force-cache",
      next: {
        tags: [tagIsFollowingUser({ myUserId: tokenUser.id, otherUserId: userId })],
      },
    });

  return (
    <form action={followOrUnfollowUser}>
      <input name="otherUserHashId" hidden type="text" value={hashidFromId(userId)} />
      <button type="submit">{existingFollow ? "unfollow" : "follow"}</button>
    </form>
  );
}
