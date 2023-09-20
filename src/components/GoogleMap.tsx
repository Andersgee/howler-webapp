"use client";

import { useEffect, useRef } from "react";
import { useMapContext } from "#src/context/GoogleMaps";
import { googleMaps } from "#src/context/GoogleMaps/google-maps";

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
      <div className="flex flex-col items-center">
        {/*<Button variant="secondary" onClick={() => mapDispatch({ type: "toggle", name: "map" })}>
          Show map
        </Button>
  */}
        <div
          ref={mapRef}
          data-visible={visible || undefined}
          className="invisible h-0 w-full
            data-[visible]:visible data-[visible]:h-96"
        />
      </div>
    </div>
  );
}
