"use client";

import { useDialogDispatch } from "#src/context/DialogContext";
import { useUserContext } from "#src/context/UserContext";
import { api } from "#src/hooks/api";
import { Button } from "../ui/Button";

type Props = {
  initialIsFollowing: boolean;
  userId: number;
};

export function FollowUserButton({ initialIsFollowing, userId }: Props) {
  const user = useUserContext();
  const apiContext = api.useContext();
  const dialogDispatch = useDialogDispatch();

  const { data: isFollowing } = api.user.isFollowing.useQuery({ userId }, { initialData: initialIsFollowing });

  const userFollow = api.user.follow.useMutation({
    onMutate: () => apiContext.user.isFollowing.setData({ userId }, () => true),
  });
  const userUnFollow = api.user.unFollow.useMutation({
    onMutate: () => apiContext.user.isFollowing.setData({ userId }, () => false),
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
          userUnFollow.mutate({ userId });
        } else {
          userFollow.mutate({ userId });
        }
      }}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
