"use client";

import { useTransition } from "react";
import { revalidateHasJoinedEvent } from "#src/app/actions";
import { useDialogDispatch } from "#src/context/DialogContext";
import { useUserContext } from "#src/context/UserContext";
import { api } from "#src/hooks/api";
import { Button } from "./ui/Button";

type Props = {
  isJoined: boolean;
  eventHashId: string;
};

export function JoinEventButton({ isJoined, eventHashId }: Props) {
  let [isPending, startTransition] = useTransition();
  const user = useUserContext();
  const dialogDispatch = useDialogDispatch();
  const eventJoin = api.event.join.useMutation({
    onSuccess: async ({ eventId, userId }) => {
      startTransition(async () => await revalidateHasJoinedEvent({ eventId, userId }));
    },
  });
  const eventLeave = api.event.leave.useMutation({
    onSuccess: async ({ eventId, userId }) => {
      startTransition(async () => await revalidateHasJoinedEvent({ eventId, userId }));
    },
  });

  return (
    <Button
      disabled={eventJoin.isLoading || eventLeave.isLoading || isPending}
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
