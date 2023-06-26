"use client";

import { useDialogDispatch } from "#src/context/DialogContext";
import { useUserContext } from "#src/context/UserContext";
import { api } from "#src/hooks/api";
import { Button } from "./ui/Button";

type Props = {
  initialIsJoined: boolean;
  eventHashId: string;
};

export function JoinEventButton({ initialIsJoined, eventHashId }: Props) {
  const user = useUserContext();
  const utils = api.useContext();
  const dialogDispatch = useDialogDispatch();

  const { data: isJoined } = api.event.isJoined.useQuery(
    { eventHashId },
    {
      initialData: initialIsJoined,
      //staleTime: Infinity, //set this as default option on queryClient instead
    }
  );

  const eventJoin = api.event.join.useMutation({
    onMutate: () => utils.event.isJoined.setData({ eventHashId }, () => true),
  });
  const eventLeave = api.event.leave.useMutation({
    onMutate: () => utils.event.isJoined.setData({ eventHashId }, () => false),
  });

  return (
    <Button
      disabled={eventJoin.isLoading || eventLeave.isLoading}
      variant="default"
      onClick={async () => {
        if (!user) {
          dialogDispatch({ type: "show", name: "signin" });
        } else if (isJoined) {
          eventLeave.mutate({ eventHashId });
        } else {
          eventJoin.mutate({ eventHashId });
        }
      }}
    >
      {isJoined ? "Leave" : "Join"}
    </Button>
  );
}
