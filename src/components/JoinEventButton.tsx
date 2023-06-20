"use client";

import { useState } from "react";
import { useDialogDispatch } from "#src/context/DialogContext";
import { useUserContext } from "#src/context/UserContext";
import { api } from "#src/hooks/api";
import { Button } from "./ui/Button";

type Props = {
  isJoined: boolean;
  eventHashId: string;
};

export function JoinEventButton({ isJoined, eventHashId }: Props) {
  const [joined, setJoined] = useState(isJoined);
  const user = useUserContext();
  const dialogDispatch = useDialogDispatch();
  const { mutate: joinEvent, isLoading: isLoadingCreateEvent } = api.event.join.useMutation({
    onSuccess: () => setJoined(true),
  });
  const { mutate: leaveEvent, isLoading: isLoadingLeaveEvent } = api.event.leave.useMutation({
    onSuccess: () => setJoined(false),
  });

  return (
    <Button
      disabled={isLoadingCreateEvent || isLoadingLeaveEvent}
      variant="default"
      onClick={async () => {
        if (!user) {
          dialogDispatch({ type: "show", name: "signin" });
        } else if (joined) {
          leaveEvent({ eventHashId });
        } else {
          joinEvent({ eventHashId });
        }
      }}
    >
      {joined ? "Leave" : "Join"}
    </Button>
  );
}
