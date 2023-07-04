"use client";

import { useMemo, useState } from "react";
import { api } from "#src/hooks/api";
import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { cn } from "#src/utils/cn";
import { prettyDate, prettyDateShort } from "#src/utils/date";
import { Button } from "./ui/Button";
import { ScrollArea } from "./ui/ScrollArea";
import { LinkUserImageFromId } from "./UserImageQuery";

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
      if (isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    [hasNextPage, isFetchingNextPage]
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
    <div className="container flex justify-center">
      <div className="grow">
        <ScrollArea className="h-72 w-full grow rounded-md border p-4">
          <div ref={ref}>{isFetchingNextPage ? "loading..." : hasNextPage ? "-" : "this is the beginning of chat"}</div>

          {/*
          <div className="flex flex-col-reverse">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "my-1 flex shrink items-center rounded-md p-1 text-sm",
                  message.userId === userId ? "bg-accent flex-row-reverse" : "bg-secondary justify-start"
                )}
              >
                <div>
                  <LinkUserImageFromId userId={message.userId} />
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          */}

          <div className="mx-2 flex grow flex-col-reverse">
            {messages.map((message, ind) => {
              if (message.userId !== userId || ind === 2 || ind === 5) {
                return (
                  <div key={message.id} className="my-2 flex w-4/5">
                    <LinkUserImageFromId userId={message.userId} />
                    <div className="flex flex-col items-start">
                      <p className="text-tweet bg-secondary mt-2 rounded-lg p-2 font-medium">{message.text}</p>
                      <div className="text-xs">{prettyDateShort(message.createdAt)}</div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={message.id}>
                  <div className="my-2 flex justify-end gap-2">
                    <div className="flex w-4/5 flex-col items-end">
                      <p className="text-tweet mt-2 rounded-lg bg-blue-600 p-2 font-medium text-white">
                        {message.text}
                      </p>
                      <div className="text-xs">{prettyDateShort(message.createdAt)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
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
    </div>
  );
}
