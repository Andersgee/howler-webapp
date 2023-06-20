"use client";

import { useDialogDispatch } from "#src/context/DialogContext";
import { useUserContext } from "#src/context/UserContext";
import { api } from "#src/hooks/api";
import { Button } from "./ui/Button";

type Props = {
  isFollowing: boolean;
  userHashId: string;
};

export function FollowUserButton({ isFollowing, userHashId }: Props) {
  const user = useUserContext();
  const dialogDispatch = useDialogDispatch();
  const { mutate: followUser, isLoading: isLoadinFollow } = api.user.follow.useMutation();
  const { mutate: unFollowUser, isLoading: isLoadingUnFollow } = api.user.unFollow.useMutation();

  return (
    <Button
      disabled={isLoadinFollow || isLoadingUnFollow}
      variant="default"
      onClick={async () => {
        if (!user) {
          dialogDispatch({ type: "show", name: "signin" });
        } else if (isFollowing) {
          unFollowUser({ userHashId });
        } else {
          followUser({ userHashId });
        }
      }}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
