"use client";

import { useEffect, useState } from "react";
import { GOOGLE_MAPS_ELEMENT_ID, googleMaps } from "#src/context/GoogleMaps/google-maps";
import { LocateButton, type Pos } from "./buttons/LocateButton";
import { Button } from "./ui/Button";

export function GoogleMap() {
  const [userPos, setUserPos] = useState<Pos | undefined>();

  useEffect(() => {
    if (!userPos) return;
    const { lng, lat } = userPos;
    googleMaps.setPos({ lng, lat, zoom: 10 });
    googleMaps.addMarker({ lng, lat });
  }, [userPos]);

  return (
    <>
      <style jsx global>{`
        html,
        body {
          height: 100%;
        }
      `}</style>
      <div className="absolute inset-x-0 bottom-4 z-50 mx-auto">
        <LocateButton onLocated={(pos) => setUserPos(pos)} label="Go to your position" />
        <Button onClick={() => googleMaps.clearMarkers()}>clear markers</Button>
      </div>
      <div id={GOOGLE_MAPS_ELEMENT_ID} className="h-full-minus-nav w-full" />
    </>
  );
}
