"use client";

import { useDialogDispatch } from "#src/context/DialogContext";
import { useUserContext } from "#src/context/UserContext";
import { api } from "#src/hooks/api";
import { Button } from "./ui/Button";

type Props = {
  isJoined: boolean;
  eventHashId: string;
};

export function JoinLeaveEventButton({ isJoined, eventHashId }: Props) {
  const user = useUserContext();
  const dialogDispatch = useDialogDispatch();
  const { mutate: joinEvent, isLoading: isLoadingCreateEvent } = api.event.join.useMutation();
  const { mutate: leaveEvent, isLoading: isLoadingLeaveEvent } = api.event.leave.useMutation();

  return (
    <Button
      disabled={isLoadingCreateEvent || isLoadingLeaveEvent}
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
