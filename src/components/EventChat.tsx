"use client";

import { useMemo, useState } from "react";
import { api } from "#src/hooks/api";
import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { cn } from "#src/utils/cn";
import { Button } from "./ui/Button";

function useEventchatInfiniteMessages<T extends HTMLElement = HTMLDivElement>(eventId: number) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.eventchat.infiniteMessages.useInfiniteQuery(
    { eventId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const ref = useIntersectionObserverCallback<T>(
    ([entry]) => {
      const isIntersecting = !!entry?.isIntersecting;
      console.log({ isIntersecting, hasNextPage });
      if (hasNextPage && isIntersecting) fetchNextPage();
    },
    [hasNextPage]
  );

  const messages = useMemo(() => data?.pages.flatMap((page) => page.messages) || [], [data]);
  return { ref, messages, isFetchingNextPage, hasNextPage };
}

type Props = {
  eventId: number;
  userId: number;
};

export function EventChat({ eventId, userId }: Props) {
  const { messages, hasNextPage, isFetchingNextPage, ref } = useEventchatInfiniteMessages(eventId);

  const apiContext = api.useContext();

  const [text, setText] = useState("");
  const eventchatSend = api.eventchat.send.useMutation({
    onSettled: () => setText(""),
    onSuccess: () => {
      //apiContext.eventchat.infiniteMessages. latest10.invalidate();
    },
  });

  return (
    <div>
      <div ref={ref}>auto load more when this div is visible</div>
      <div>isFetchingNextPage: {JSON.stringify(isFetchingNextPage)}</div>
      <div>hasNextPage: {JSON.stringify(hasNextPage)}</div>
      <ul>
        {messages.map((message) => (
          <li key={message.id} className={cn("text-sm", message.userId === userId ? "bg-accent" : "bg-secondary")}>
            {`id: ${message.id}, text: ${message.text}`}
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
