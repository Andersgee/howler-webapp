"use client";

import { useEffect } from "react";
import { api, type RouterOutputs } from "#src/hooks/api";
import { useImageUpload } from "#src/hooks/useImageUpload";
import { OutPortal } from "#src/lib/reverse-portal";
import { useStore } from "#src/store";
import { FullsizeImageButton } from "./buttons/FullsizeImageButton";
import { InputFileButton } from "./buttons/InputFileButton";
import { EventImage } from "./EventImage";
import { IconArrowDown, IconImage, IconLoadingSpinner, IconWhat, IconWhen, IconWhere, IconWho } from "./Icons";
import { Button, buttonStylesSecondary } from "./ui/Button";
import { LinkUserImage } from "./UserImage";
import { WhenText } from "./WhenText";

type Props = {
  eventId: number;
  initialEventInfo: NonNullable<RouterOutputs["event"]["info"]>;
  initialEventLocation: RouterOutputs["event"]["location"];
  isCreator: boolean;
};

export function EventInfo({ eventId, initialEventInfo, initialEventLocation, isCreator }: Props) {
  const toggleShowGoogleMaps = useStore.select.toggleShowGoogleMaps();

  const mapIsVisible = useStore.select.showGoogleMaps();
  const googleMaps = useStore.select.googleMaps();
  const mapPortalNode = useStore.select.mapPortalNode();

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

  const eventLocationUpdate = api.event.updateLocation.useMutation({
    onSuccess: (updatedLocation) => {
      if (updatedLocation) {
        apiContext.event.location.setData({ eventId }, () => updatedLocation);
      }
    },
    //onSettled: () => mapDispatch({ type: "hide", name: "map" }),
  });

  useEffect(() => {
    if (!location || !googleMaps) return;
    googleMaps.showEventMarker({ lng: location.lng, lat: location.lat });
  }, [location, googleMaps]);

  if (!event) return null;

  const handleSavePickedLocation = () => {
    if (!googleMaps) return;

    const c = googleMaps.currentCenter;
    if (c) {
      eventLocationUpdate.mutate({ eventId, lng: c.lng, lat: c.lat });
    }
    googleMaps.hideCurrentCenterMarker();
    //mapDispatch({ type: "show", name: "map" });
  };

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

      {isCreator && (
        <div className="flex items-center gap-1">
          <IconWhere />
          <span className="w-16 pr-2">Where?</span>
          <Button
            variant="secondary"
            onClick={() => {
              toggleShowGoogleMaps();
              googleMaps?.showCurrentCenterMarker();
            }}
            //className="bg-white px-2 py-1 dark:bg-black"
          >
            {mapIsVisible ? "hide map" : location?.placeName ?? "show map"}
          </Button>
          <Button
            disabled={!mapIsVisible}
            variant="default"
            onClick={handleSavePickedLocation}
            //className="bg-white px-2 py-1 dark:bg-black"
          >
            save
          </Button>
        </div>
      )}

      <div>portaled content below here?</div>
      <div className="h-96 w-full">{mapPortalNode && <OutPortal node={mapPortalNode} />}</div>
      <div>portaled content above here?</div>
      {!isCreator && (
        <div className="flex items-center gap-1">
          <IconWhere />
          <span className="w-16 pr-2">Where?</span>
          {location ? (
            <Button
              variant="secondary"
              onClick={() => {
                toggleShowGoogleMaps();
                googleMaps?.hideCurrentCenterMarker();
              }}
            >
              {mapIsVisible ? "hide map" : location?.placeName ?? "show map"}
            </Button>
          ) : (
            <div className="bg-white px-2 py-1 dark:bg-black">anywhere</div>
          )}
        </div>
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
