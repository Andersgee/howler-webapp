import { getJoinedUserIds } from "./data";
import { IconHowler } from "src/icons/Howler";

import { actionJoinOrLeaveEvent } from "./actions";
import type { TokenUser } from "src/utils/token/schema";

type Props = {
  eventHashid: string;
  user: TokenUser | null;
};
export async function JoinButton({ user, eventHashid }: Props) {
  const joinedUserIds = await getJoinedUserIds(eventHashid);
  const userHasJoined = user && joinedUserIds.includes(user.id);

  return (
    <form action={actionJoinOrLeaveEvent}>
      <input type="hidden" name="eventhashid" value={eventHashid} />
      <button
        type="submit"
        className="flex w-40 items-center justify-center rounded-full border-2 border-black bg-blue-50 px-2 py-2 transition-colors hover:bg-blue-200"
      >
        <span className="mr-2 text-2xl text-black">{userHasJoined ? "leave" : "join"}</span>
        <IconHowler />
      </button>
    </form>
  );
}
