"use client";

import { useUserContext } from "#src/context/UserContext";
import { api } from "#src/hooks/api";
import { useStore } from "#src/store";
import { Button } from "../ui/Button";

type Props = {
  initialIsFollowing: boolean;
  userId: number;
};

export function FollowUserButton({ initialIsFollowing, userId }: Props) {
  const user = useUserContext();
  const apiContext = api.useContext();

  const dialogAction = useStore.select.dialogAction();

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
          dialogAction({ type: "show", name: "signin" });
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
