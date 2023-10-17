"use client";

import { api, type RouterOutputs } from "#src/hooks/api";
import { FullsizeImageButton } from "../buttons/FullsizeImageButton";
import { EventImage } from "../EventImage";
import { IconArrowDown, IconWhat, IconWhen, IconWho } from "../Icons";
import { LinkUserImage } from "../UserImage";
import { WhenText } from "../WhenText";
import { ImageUploadButton } from "./ImageUploadButton";
import { Where, WhereForCreator } from "./Where";

type Props = {
  eventId: number;
  initialEventInfo: NonNullable<RouterOutputs["event"]["info"]>;
  initialEventLocation: RouterOutputs["event"]["location"];
  isCreator: boolean;
};

export function EventInfo({ eventId, initialEventInfo, initialEventLocation, isCreator }: Props) {
  const { data: event } = api.event.info.useQuery({ eventId }, { initialData: initialEventInfo });

  if (!event) return null;

  return (
    <div className="flex flex-col gap-3">
      {event.image && (
        <div className="mt-2 flex justify-center">
          <FullsizeImageButton title={event.what} src={event.image} alt={event.what}>
            <EventImage src={event.image} alt={event.what} />
          </FullsizeImageButton>
        </div>
      )}
      {isCreator && <ImageUploadButton eventId={event.id} />}

      <div className="flex items-center text-sm">
        <div>created by </div>
        <LinkUserImage src={event.creator.image!} alt={event.creator.name} userId={event.creator.id} />
      </div>
      <div className="flex items-center gap-1">
        <IconWhat className="" />
        <span className="w-16 pr-2">What?</span>
        <div className="flex items-center bg-white px-2 py-1 dark:bg-black">{event.what || "anything"}</div>
      </div>

      {isCreator ? (
        <WhereForCreator eventId={event.id} initialEventLocation={initialEventLocation} />
      ) : (
        <Where eventId={event.id} initialEventLocation={initialEventLocation} />
      )}

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
