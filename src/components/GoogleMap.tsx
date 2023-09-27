"use client";

import { useEffect, useRef } from "react";
import { useMapContext } from "#src/context/GoogleMaps";
import { googleMaps } from "#src/context/GoogleMaps/google-maps";
import { LocateButton } from "./buttons/LocateButton";

export function GoogleMap() {
  const mapRef = useRef(null);
  const { googleMapIsReady, visible } = useMapContext();
  //const mapDispatch = useMapDispatch();
  useEffect(() => {
    if (!googleMapIsReady || !mapRef.current) return;
    googleMaps.render(mapRef.current);
  }, [googleMapIsReady]);

  return (
    <div className="container">
      <div className="relative flex flex-col items-center">
        <div
          ref={mapRef}
          data-visible={visible || undefined}
          className="invisible relative h-0 w-full
            data-[visible]:visible data-[visible]:h-96"
        />
        <div
          data-visible={visible || undefined}
          className="invisible absolute bottom-4 left-2 z-50 mx-auto data-[visible]:visible"
        >
          <LocateButton
            onLocated={(pos) => {
              if (googleMapIsReady) {
                googleMaps.setPos({
                  lat: pos.lat,
                  lng: pos.lng,
                  zoom: 10,
                });
              }
            }}
            label="Go to your position"
          />
        </div>
      </div>
    </div>
  );
}
