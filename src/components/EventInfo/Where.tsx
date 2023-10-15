"use client";

import { useState } from "react";
import { api, type RouterOutputs } from "#src/hooks/api";
import { useStore } from "#src/store";
import { LocateButton } from "../buttons/LocateButton";
import { GoogleMap } from "../GoogleMap";
import { IconWhere } from "../Icons";
import { Button } from "../ui/Button";

type Props = {
  className?: string;
  eventId: number;
  initialEventLocation: RouterOutputs["event"]["location"];
};

export function Where({ className, eventId, initialEventLocation }: Props) {
  const [mapIsVisible, setMapIsVisible] = useState(false);
  const { data: eventLocation } = api.event.location.useQuery({ eventId }, { initialData: initialEventLocation });
  const googleMaps = useStore.select.googleMaps();

  return (
    <div className={className}>
      <div className="flex items-center gap-1">
        <IconWhere />
        <span className="w-16 pr-2">Where?</span>
        {eventLocation ? (
          mapIsVisible ? (
            <Button variant="secondary" onClick={() => setMapIsVisible(false)}>
              Hide map
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                const lng = eventLocation.lng;
                const lat = eventLocation.lat;
                googleMaps?.setPos({ lng, lat, zoom: 11 });
                //googleMaps?.showEventMarker({ lng, lat });
                setMapIsVisible(true);
              }}
            >
              {eventLocation?.placeName || "Show map"}
            </Button>
          )
        ) : (
          <div>anywhere</div>
        )}
      </div>
      {mapIsVisible && (
        <div className="my-1 h-96 w-full">
          <GoogleMap />
        </div>
      )}
    </div>
  );
}

export function WhereForCreator({ className, eventId, initialEventLocation }: Props) {
  const [mapIsVisible, setMapIsVisible] = useState(false);
  const { data: eventLocation } = api.event.location.useQuery({ eventId }, { initialData: initialEventLocation });
  const googleMaps = useStore.select.googleMaps();
  const apiContext = api.useContext();

  const eventUpdateLocation = api.event.updateLocation.useMutation({
    onSuccess: (updatedLocation) => {
      if (updatedLocation) {
        apiContext.event.location.setData({ eventId }, () => updatedLocation);
      }
    },
  });

  return (
    <div className={className}>
      <div className="flex items-center gap-1">
        <IconWhere />
        <span className="w-16 pr-2">Where?</span>
        {mapIsVisible ? (
          <div className="flex gap-2">
            <Button
              disabled={eventUpdateLocation.isLoading}
              variant="default"
              onClick={async () => {
                const c = googleMaps?.currentCenter;
                if (c) {
                  await eventUpdateLocation.mutateAsync({ eventId, lng: c.lng, lat: c.lat });
                }
                setMapIsVisible(false);
              }}
            >
              Save
            </Button>
            <Button disabled={eventUpdateLocation.isLoading} variant="secondary" onClick={() => setMapIsVisible(false)}>
              Cancel
            </Button>
            <LocateButton
              label="Your location"
              onLocated={(pos) => googleMaps?.setPos({ lng: pos.lng, lat: pos.lat, zoom: 11 })}
            />
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={() => {
              if (eventLocation) {
                const lng = eventLocation.lng;
                const lat = eventLocation.lat;
                //googleMaps?.setPos({ lng, lat, zoom: 11 });
              }
              //googleMaps?.showCurrentCenterMarkerOnly();
              setMapIsVisible(true);
            }}
          >
            {eventLocation?.placeName || "Pick a place"}
          </Button>
        )}
      </div>
      {mapIsVisible && (
        <div className="my-1 h-96 w-full">
          <GoogleMap />
        </div>
      )}
    </div>
  );
}
