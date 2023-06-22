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
  const userFollow = api.user.follow.useMutation();
  const userUnFollow = api.user.unFollow.useMutation();

  return (
    <Button
      disabled={userFollow.isLoading || userUnFollow.isLoading}
      variant="default"
      onClick={async () => {
        if (!user) {
          dialogDispatch({ type: "show", name: "signin" });
        } else if (isFollowing) {
          userUnFollow.mutate({ userHashId });
        } else {
          userFollow.mutate({ userHashId });
        }
      }}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
