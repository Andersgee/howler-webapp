"use client";

import { useDialogDispatch } from "#src/context/DialogContext";
import { useUserContext } from "#src/context/UserContext";
import { api } from "#src/hooks/api";
import { Button } from "../ui/Button";

type Props = {
  initialIsFollowing: boolean;
  userHashId: string;
};

export function FollowUserButton({ initialIsFollowing, userHashId }: Props) {
  const user = useUserContext();
  const utils = api.useContext();
  const dialogDispatch = useDialogDispatch();

  const { data: isFollowing } = api.user.isFollowing.useQuery({ userHashId }, { initialData: initialIsFollowing });

  const userFollow = api.user.follow.useMutation({
    onMutate: () => utils.user.isFollowing.setData({ userHashId }, () => true),
  });
  const userUnFollow = api.user.unFollow.useMutation({
    onMutate: () => utils.user.isFollowing.setData({ userHashId }, () => false),
  });

  return (
    <Button
      disabled={userFollow.isLoading || userUnFollow.isLoading}
      size="lg"
      variant="optimisticdefault"
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
