"use client";

import { useDialogDispatch } from "#src/context/DialogContext";
import { useUserContext } from "#src/context/UserContext";
import { api } from "#src/hooks/api";
import { Button } from "../ui/Button";

type Props = {
  initialIsJoined: boolean;
  eventId: number;
};

export function JoinEventButton({ initialIsJoined, eventId }: Props) {
  const user = useUserContext();
  const apiContext = api.useContext();
  const dialogDispatch = useDialogDispatch();

  const { data: isJoined } = api.event.isJoined.useQuery({ eventId }, { initialData: initialIsJoined });

  const eventJoin = api.event.join.useMutation({
    onMutate: () => apiContext.event.isJoined.setData({ eventId }, () => true),
  });
  const eventLeave = api.event.leave.useMutation({
    onMutate: () => apiContext.event.isJoined.setData({ eventId }, () => false),
  });

  return (
    <Button
      disabled={eventJoin.isLoading || eventLeave.isLoading}
      size="lg"
      variant="optimisticdefault"
      onClick={async () => {
        if (!user) {
          dialogDispatch({ type: "show", name: "signin" });
        } else if (isJoined) {
          eventLeave.mutate({ eventId });
        } else {
          eventJoin.mutate({ eventId });
        }
      }}
    >
      {isJoined ? "Leave" : "Join"}
    </Button>
  );
}
