"use client";

import { useState } from "react";
import { api } from "#src/hooks/api";
import { cn } from "#src/utils/cn";
import { Button } from "./ui/Button";

type Props = {
  eventId: number;
  userId: number;
};

export function EventChat({ eventId, userId }: Props) {
  const eventchatLatest10 = api.eventchat.latest10.useQuery({ eventId });
  const apiContext = api.useContext();

  const [text, setText] = useState("");
  const eventchatSend = api.eventchat.send.useMutation({
    onSettled: () => setText(""),
    onSuccess: () => {
      apiContext.eventchat.latest10.invalidate();
    },
  });

  return (
    <div>
      <ul>
        {eventchatLatest10.data?.map((message) => (
          <li key={message.id} className={cn("text-sm", message.creatorId === userId ? "bg-accent" : "bg-secondary")}>
            {message.text}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="flex justify-end">
          <Button
            disabled={!text || eventchatSend.isLoading}
            onClick={() => {
              eventchatSend.mutate({ eventId, text });
            }}
          >
            send
          </Button>
        </div>
      </div>
    </div>
  );
}
