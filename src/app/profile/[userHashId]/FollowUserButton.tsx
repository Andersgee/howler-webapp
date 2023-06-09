import { followOrUnfollowUser } from "src/app/actions";
import { db } from "src/db";
import { hashidFromId } from "src/utils/hashid";
import { tagIsFollowingUser } from "src/utils/tags";

type Props = {
  className?: string;
  myUserId: number;
  otherUserId: number;
};

export async function FollowUserButton({ className = "", myUserId, otherUserId }: Props) {
  const existingFollow = await db
    .selectFrom("Follow")
    .select(["userId", "followerId"])
    .where("followerId", "=", myUserId)
    .where("userId", "=", otherUserId)
    .getFirst({
      cache: "force-cache",
      next: {
        tags: [tagIsFollowingUser({ myUserId, otherUserId })],
      },
    });

  if (myUserId === otherUserId) return null;

  return (
    <form action={followOrUnfollowUser}>
      <input name="otherUserHashId" hidden type="text" value={hashidFromId(otherUserId)} />
      <button type="submit">{existingFollow ? "unfollow" : "follow"}</button>
    </form>
  );
}
