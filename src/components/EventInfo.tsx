"use client";

import { api, type RouterOutputs } from "#src/hooks/api";
import { IconArrowDown, IconWhat, IconWhen, IconWhere, IconWho } from "./Icons";
import { LinkUserImage } from "./UserImage";
import { WhenText } from "./WhenText";

type Props = {
  initialEventInfo: NonNullable<RouterOutputs["event"]["info"]>;
  eventId: number;
};

export function EventInfo({ initialEventInfo, eventId }: Props) {
  const { data: event } = api.event.info.useQuery({ eventId }, { initialData: initialEventInfo });

  if (!event) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center text-sm">
        <div>created by </div>
        <LinkUserImage src={event.creator.image!} alt={event.creator.name} userId={event.creator.id} />
      </div>
      <div className="flex items-center gap-1">
        <IconWhat className="" />
        <span className="w-16 pr-2">What?</span>
        <div className="flex items-center bg-white px-2 py-1 dark:bg-black">{event.what || "anything"}</div>
      </div>
      <div className="flex items-center gap-1">
        <IconWhere />
        <span className="w-16 pr-2">Where?</span>
        <div className="bg-white px-2 py-1 dark:bg-black">{event.where || "anywhere"}</div>
      </div>
      <div className="flex items-center gap-1">
        <IconWho />
        <span className="w-16 pr-2">Who?</span>
        <div className="bg-white px-2 py-1 dark:bg-black">{event.who || "anyone"}</div>
      </div>
      <div className="flex items-start gap-1">
        <IconWhen />
        <span className="w-16 pr-2">When?</span>
        <div className="flex flex-col items-center bg-white dark:bg-black">
          <div className="bg-white px-2 py-1 dark:bg-black">
            <WhenText date={event.when} />
          </div>
          <IconArrowDown height={18} width={18} className="my-1" />
          <div className="bg-white px-2 py-1 dark:bg-black">
            <WhenText date={event.whenEnd} />
          </div>
        </div>
      </div>
    </div>
  );
}
