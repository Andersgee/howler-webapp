"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFcmContext } from "#src/context/Fcm";
import { api } from "#src/hooks/api";
import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { cn } from "#src/utils/cn";
import { prettyDateShort } from "#src/utils/date";
import { JoinEventButton } from "./buttons/JoinEventButton";
import { IconSend } from "./Icons";
import { Button } from "./ui/Button";
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
  const eventChatMessages = useMemo(() => chatMessages.filter((m) => m.eventId === eventId), [eventId, chatMessages]);

  return eventChatMessages;
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

  const inputRef = useRef<HTMLInputElement>(null);

  const eventchatSend = api.eventchat.send.useMutation({
    onSettled: () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  });

  const endOfChatRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (endOfChatRef.current) {
      if (pushedMessages.length > 0) {
        endOfChatRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [pushedMessages]);

  useEffect(() => {
    if (endOfChatRef.current && isFirstRender.current && messages.length > 0) {
      isFirstRender.current = false;
      endOfChatRef.current.scrollIntoView({
        behavior: "instant",
      });
    }
  }, [messages]);

  if (!isJoined) {
    return (
      <div className="container flex justify-center">
        <div>
          <h1>Need to join to chat</h1>
          <JoinEventButton initialIsJoined={initialIsJoined} eventId={eventId} />
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        html,
        body {
          height: 100%;
        }
      `}</style>
      <div className="chatheight container max-w-lg overflow-scroll shadow-sm">
        <div className="flex h-full flex-col px-3">
          <div className="text-paragraph text-center" ref={ref}>
            {isFetchingNextPage ? "loading..." : hasNextPage ? "-" : "this is the beginning of conversation"}
          </div>
          <div className="flex flex-col-reverse">
            {pushedMessages.map((message) => {
              const isNotMe = message.userId !== userId;
              return (
                <div key={message.id} className={cn("my-2 flex", isNotMe ? " w-4/5" : "justify-end gap-2")}>
                  {isNotMe && <LinkUserImageFromId userId={message.userId} />}
                  <div className={cn("flex flex-col", isNotMe ? "items-start" : "w-4/5 items-end")}>
                    <p
                      className={cn(
                        "text-tweet rounded-lg p-2 font-medium",
                        isNotMe ? "bg-secondary mt-1.5" : "mt-2 bg-blue-600 text-white"
                      )}
                    >
                      {message.text}
                    </p>
                    <p className="text-xs">{prettyDateShort(message.createdAt)}</p>
                  </div>
                </div>
              );
            })}

            {messages.map((message) => {
              const isNotMe = message.userId !== userId;
              return (
                <div key={message.id} className={cn("my-2 flex", isNotMe ? " w-4/5" : "justify-end gap-2")}>
                  {isNotMe && <LinkUserImageFromId userId={message.userId} />}
                  <div className={cn("flex flex-col", isNotMe ? "items-start" : "w-4/5 items-end")}>
                    <p
                      className={cn(
                        "text-tweet rounded-lg p-2 font-medium",
                        isNotMe ? "bg-secondary mt-1.5" : "mt-2 bg-blue-600 text-white"
                      )}
                    >
                      {message.text}
                    </p>
                    <p className="text-xs">{prettyDateShort(message.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div ref={endOfChatRef} className="h-[1px]"></div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <div className="container max-w-lg">
          <div className="flex items-center">
            <input
              autoComplete="off"
              //autoFocus
              name="chatmessage"
              ref={inputRef}
              type="text"
              placeholder="Your message"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 grow rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <Button
              className="ml-1"
              disabled={eventchatSend.isLoading}
              onPointerDown={(e) => {
                e.preventDefault();
                if (inputRef.current?.value) {
                  eventchatSend.mutate({ eventId, text: inputRef.current.value });
                }
              }}
              //onClick={() => {
              //  if (inputRef.current?.value) {
              //
              //    eventchatSend.mutate({ eventId, text: inputRef.current.value });
              //  }
              //}}
            >
              <IconSend className="" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/*



return (
    <div className="container mt-4 flex justify-center">
      <div className="max-w-md grow">
        <div className="">
          <div className="text-paragraph text-center" ref={ref}>
            {!isJoined
              ? "need to join to be able see chat"
              : isFetchingNextPage
              ? "loading..."
              : hasNextPage
              ? "-"
              : "this is the beginning of conversation"}
          </div>
          {isJoined && (
            <div className="mx-2 flex grow flex-col-reverse">
              {pushedMessages.map((message) => {
                const isNotMe = message.userId !== userId;
                return (
                  <div key={message.id} className={cn("my-2 flex", isNotMe ? " w-4/5" : "justify-end gap-2")}>
                    {isNotMe && <LinkUserImageFromId userId={message.userId} />}
                    <div className={cn("flex flex-col", isNotMe ? "items-start" : "w-4/5 items-end")}>
                      <p
                        className={cn(
                          "text-tweet rounded-lg p-2 font-medium",
                          isNotMe ? "bg-secondary mt-1.5" : "mt-2 bg-blue-600 text-white"
                        )}
                      >
                        {message.text}
                      </p>
                      <p className="text-xs">{prettyDateShort(message.createdAt)}</p>
                    </div>
                  </div>
                );
              })}

              {messages.map((message) => {
                const isNotMe = message.userId !== userId;
                return (
                  <div key={message.id} className={cn("my-2 flex", isNotMe ? " w-4/5" : "justify-end gap-2")}>
                    {isNotMe && <LinkUserImageFromId userId={message.userId} />}
                    <div className={cn("flex flex-col", isNotMe ? "items-start" : "w-4/5 items-end")}>
                      <p
                        className={cn(
                          "text-tweet rounded-lg p-2 font-medium",
                          isNotMe ? "bg-secondary mt-1.5" : "mt-2 bg-blue-600 text-white"
                        )}
                      >
                        {message.text}
                      </p>
                      <p className="text-xs">{prettyDateShort(message.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div ref={endOfChatRef} className="h-[1px]"></div>
        </div>
        <div className="m-1 flex items-center">
          <input
            name="chatmessage"
            ref={inputRef}
            type="text"
            placeholder="Your message"
            //value={text}
            //onChange={(e) => setText(e.target.value)}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 grow rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <Button
            className="ml-1"
            disabled={eventchatSend.isLoading || !isJoined}
            onClick={() => {
              if (inputRef.current?.value) {
                eventchatSend.mutate({ eventId, text: inputRef.current.value });
              }
            }}
          >
            <IconSend className="" />
          </Button>
        </div>
      </div>
    </div>
  );

  */
