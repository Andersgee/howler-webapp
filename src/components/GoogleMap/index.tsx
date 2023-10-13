"use client";

import { useEffect, useRef } from "react";
import { LocateButton } from "#src/components/buttons/LocateButton";
import { useStore } from "#src/store";

export function GoogleMap() {
  const mapRef = useRef(null);
  const googleMaps = useStore.select.googleMaps();
  const visible = useStore.select.showGoogleMaps();

  useEffect(() => {
    if (!googleMaps || !mapRef.current) return;
    googleMaps.render(mapRef.current);
  }, [googleMaps]);

  return (
    <div className="container px-4">
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
            onLocated={(pos) =>
              googleMaps?.setPos({
                lat: pos.lat,
                lng: pos.lng,
                zoom: 10,
              })
            }
            label="Go to your position"
          />
        </div>
      </div>
    </div>
  );
}
