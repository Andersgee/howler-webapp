"use client";

import { useEffect } from "react";
import { useMapContext, useMapDispatch } from "#src/context/GoogleMaps";
import { googleMaps } from "#src/context/GoogleMaps/google-maps";
import { api, type RouterOutputs } from "#src/hooks/api";
import { IconArrowDown, IconWhat, IconWhen, IconWhere, IconWho } from "./Icons";
import { Button } from "./ui/Button";
import { LinkUserImage } from "./UserImage";
import { WhenText } from "./WhenText";

type Props = {
  eventId: number;
  initialEventInfo: NonNullable<RouterOutputs["event"]["info"]>;
  initialEventLocation: RouterOutputs["event"]["location"];
  isCreator: boolean;
};

export function EventInfo({ eventId, initialEventInfo, initialEventLocation, isCreator }: Props) {
  const { googleMapIsReady, visible: mapIsVisible } = useMapContext();
  const mapDispatch = useMapDispatch();
  const { data: event } = api.event.info.useQuery({ eventId }, { initialData: initialEventInfo });
  const { data: location } = api.event.location.useQuery({ eventId }, { initialData: initialEventLocation });

  const apiContext = api.useContext();
  const eventLocationUpdate = api.event.updateLocation.useMutation({
    onSuccess: (updatedLocation) => {
      if (updatedLocation) {
        apiContext.event.location.setData({ eventId }, () => updatedLocation);
      }
    },
    //onSettled: () => mapDispatch({ type: "hide", name: "map" }),
  });

  useEffect(() => {
    if (!location || !googleMapIsReady) return;
    //if (!event || !event.location) return;
    googleMaps.showEventMarker({ lng: location.lng, lat: location.lat });
  }, [location, googleMapIsReady]);

  if (!event) return null;

  const handleSavePickedLocation = () => {
    if (!googleMapIsReady) return;

    const c = googleMaps.currentCenter;
    if (c) {
      eventLocationUpdate.mutate({ eventId, lng: c.lng, lat: c.lat });
    }
    googleMaps.hideCurrentCenterMarker();
    //mapDispatch({ type: "show", name: "map" });
  };

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

      {isCreator && (
        <div className="flex items-center gap-1">
          <IconWhere />
          <span className="w-16 pr-2">Where?</span>
          <Button
            variant="secondary"
            onClick={() => {
              mapDispatch({ type: "toggle", name: "map" });
              if (googleMapIsReady) {
                googleMaps.showCurrentCenterMarker();
              }
            }}
            //className="bg-white px-2 py-1 dark:bg-black"
          >
            {mapIsVisible ? "hide map" : "show map"}
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

      {!isCreator && (
        <div className="flex items-center gap-1">
          <IconWhere />
          <span className="w-16 pr-2">Where?</span>
          {location ? (
            <Button
              variant="secondary"
              onClick={() => {
                mapDispatch({ type: "toggle", name: "map" });
                if (googleMapIsReady) {
                  googleMaps.hideCurrentCenterMarker();
                }
              }}

              //className="bg-white px-2 py-1 dark:bg-black"
            >
              {mapIsVisible ? "hide map" : "show map"}
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
