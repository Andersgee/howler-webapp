"use client";

import { useEffect } from "react";
import { api, type RouterOutputs } from "#src/hooks/api";
import { useImageUpload } from "#src/hooks/useImageUpload";
import { useStore } from "#src/store";
import { FullsizeImageButton } from "../buttons/FullsizeImageButton";
import { InputFileButton } from "../buttons/InputFileButton";
import { EventImage } from "../EventImage";
import { IconArrowDown, IconImage, IconLoadingSpinner, IconWhat, IconWhen, IconWho } from "../Icons";
import { buttonStylesSecondary } from "../ui/Button";
import { LinkUserImage } from "../UserImage";
import { WhenText } from "../WhenText";
import { Where, WhereForCreator } from "./Where";

type Props = {
  eventId: number;
  initialEventInfo: NonNullable<RouterOutputs["event"]["info"]>;
  initialEventLocation: RouterOutputs["event"]["location"];
  isCreator: boolean;
};

export function EventInfo({ eventId, initialEventInfo, initialEventLocation, isCreator }: Props) {
  const googleMaps = useStore.select.googleMaps();

  const apiContext = api.useContext();
  const { data: event } = api.event.info.useQuery({ eventId }, { initialData: initialEventInfo });
  const { data: location } = api.event.location.useQuery({ eventId }, { initialData: initialEventLocation });

  const { mutate: updateImage } = api.event.updateImage.useMutation();

  const { uploadFile, isUploading: imageIsUploading } = useImageUpload(
    { eventId },
    {
      onSuccess: ({ imageUrl }) => {
        //optimistic
        apiContext.event.info.setData({ eventId }, (prev) => {
          if (!prev) return prev;
          const data = structuredClone(prev); //dont mutate prev
          return { ...data, image: imageUrl };
        });
        //update db
        updateImage({ eventId, image: imageUrl });
      },
    }
  );

  useEffect(() => {
    if (!location || !googleMaps) return;
    googleMaps.showEventMarker({ lng: location.lng, lat: location.lat });
  }, [location, googleMaps]);

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
      {isCreator && (
        <InputFileButton
          disabled={imageIsUploading}
          accept="image/png, image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              uploadFile(file);
            }
          }}
          className={buttonStylesSecondary}
        >
          {imageIsUploading ? (
            <>
              <IconLoadingSpinner /> <span className="ml-2">Uploading</span>
            </>
          ) : (
            <>
              <IconImage /> <span className="ml-2">Select Picture...</span>
            </>
          )}
        </InputFileButton>
      )}
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
