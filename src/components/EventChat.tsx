"use client";

import { useMemo, useState } from "react";
import { useFcmContext } from "#src/context/Fcm";
import { api } from "#src/hooks/api";
import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { prettyDateShort } from "#src/utils/date";
import { IconSend } from "./Icons";
import { Button } from "./ui/Button";
import { ScrollArea } from "./ui/ScrollArea";
import { LinkUserImageFromId } from "./UserImageQuery";

function useEventchatInfiniteMessages<T extends HTMLElement = HTMLDivElement>(eventId: number, enabled: boolean) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.eventchat.infiniteMessages.useInfiniteQuery(
    { eventId },
    {
      enabled: enabled,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const ref = useIntersectionObserverCallback<T>(
    ([entry]) => {
      const isIntersecting = !!entry?.isIntersecting;
      if (enabled && isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    [hasNextPage, isFetchingNextPage, enabled]
  );

  const messages = useMemo(() => data?.pages.flatMap((page) => page.messages) || [], [data]);
  return { ref, messages, isFetchingNextPage, hasNextPage };
}

function useChatMessages(eventId: number) {
  const { chatMessages } = useFcmContext();

  return chatMessages.filter((m) => m.eventId === eventId);
}

type Props = {
  eventId: number;
  userId: number;
  initialIsJoined: boolean;
};

export function EventChat({ eventId, userId, initialIsJoined }: Props) {
  const { data: isJoined } = api.event.isJoined.useQuery({ eventId }, { initialData: initialIsJoined });
  const { messages, hasNextPage, isFetchingNextPage, ref } = useEventchatInfiniteMessages(eventId, isJoined);
  const pushedMessages = useChatMessages(eventId);

  const [text, setText] = useState("");
  const eventchatSend = api.eventchat.send.useMutation({
    onSettled: () => setText(""),
  });

  return (
    <div className="container mt-4 flex justify-center">
      <div className="max-w-md grow">
        <ScrollArea className="h-[50vh] min-h-[384px] w-full grow rounded-md border-t p-2">
          <div className="text-paragraph text-center" ref={ref}>
            {!isJoined
              ? "need to join to be able see chat"
              : isFetchingNextPage
              ? "loading..."
              : hasNextPage
              ? "-"
              : "this is the beginning of conversation"}
          </div>
          <div className="mx-2 flex grow flex-col-reverse">
            {pushedMessages.map((message) => {
              if (message.userId !== userId) {
                return (
                  <div key={message.id} className="my-2 flex w-4/5">
                    <LinkUserImageFromId userId={message.userId} />
                    <div className="flex flex-col items-start">
                      <p className="text-tweet bg-secondary mt-1.5 rounded-lg p-2 font-medium">{message.text}</p>
                      <p className="text-xs">{prettyDateShort(message.createdAt)}</p>
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
                      <p className="text-xs">{prettyDateShort(message.createdAt)}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {messages.map((message, i) => {
              if (message.userId !== userId) {
                return (
                  <div key={message.id} className="my-2 flex w-4/5">
                    <LinkUserImageFromId userId={message.userId} />
                    <div className="flex flex-col items-start">
                      <p className="text-tweet bg-secondary mt-1.5 rounded-lg p-2 font-medium">{message.text}</p>
                      <p className="text-xs">{prettyDateShort(message.createdAt)}</p>
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
                      <p className="text-xs">{prettyDateShort(message.createdAt)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="m-1 flex items-center">
          <input
            type="text"
            placeholder="Your message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 grow rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <Button
            className="ml-1"
            disabled={!text || eventchatSend.isLoading || !isJoined}
            onClick={() => {
              eventchatSend.mutate({ eventId, text });
            }}
          >
            <IconSend className="" />
          </Button>
        </div>
      </div>
    </div>
  );
}
