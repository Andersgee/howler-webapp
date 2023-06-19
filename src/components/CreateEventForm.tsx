"use client";

import { useRouter } from "next/navigation";
import { api } from "#src/hooks/api";

export function CreateEventForm() {
  const router = useRouter();
  const { mutate: createEvent, isLoading } = api.event.create.useMutation({
    onSuccess: ({ eventHashId }) => {
      router.push(`/event/${eventHashId}`);
    },
  });

  return (
    <div className="">
      <button
        disabled={isLoading}
        className="bg-green-500 disabled:bg-red-500"
        onClick={() => {
          createEvent({
            what: "debug what",
            when: new Date(),
            whenEnd: new Date(),
            where: "debug where",
            who: "debug who",
          });
        }}
      >
        CREATE EVENT
      </button>
    </div>
  );
}
