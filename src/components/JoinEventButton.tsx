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
  const { mutate: joinEvent, isLoading: isLoadingCreateEvent } = api.event.join.useMutation({
    onSuccess: async ({ eventId, userId }) => {
      startTransition(async () => await revalidateHasJoinedEvent({ eventId, userId }));
    },
  });
  const { mutate: leaveEvent, isLoading: isLoadingLeaveEvent } = api.event.leave.useMutation({
    onSuccess: async ({ eventId, userId }) => {
      startTransition(async () => await revalidateHasJoinedEvent({ eventId, userId }));
    },
  });

  return (
    <Button
      disabled={isLoadingCreateEvent || isLoadingLeaveEvent || isPending}
      variant="default"
      onClick={async () => {
        if (!user) {
          dialogDispatch({ type: "show", name: "signin" });
        } else if (isJoined) {
          leaveEvent({ eventHashId });
        } else {
          joinEvent({ eventHashId });
        }
      }}
    >
      {isJoined ? "Leave" : "Join"}
    </Button>
  );
}
