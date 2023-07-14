"use client";

import { useRouter } from "next/navigation";
import { api } from "#src/hooks/api";
import { Button } from "../ui/Button";

type Props = {
  eventId: number;
};

export function DeleteEventButton({ eventId }: Props) {
  const router = useRouter();
  const eventDelete = api.event.delete.useMutation({
    onSuccess: () => {
      router.push("/");
    },
  });

  return (
    <Button
      disabled={eventDelete.isLoading}
      size="lg"
      variant="destructive"
      onClick={async () => {
        eventDelete.mutate({ eventId });
      }}
    >
      Delete
    </Button>
  );
}
