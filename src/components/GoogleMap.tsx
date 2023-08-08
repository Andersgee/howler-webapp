"use client";

import { useEffect, useState } from "react";
import { useGoogleMaps } from "#src/hooks/useGoogleMaps";
import { LocateButton, type Pos } from "./buttons/LocateButton";

export function GoogleMap() {
  const { elementRef, googlemaps, setPos, addMarker } = useGoogleMaps<HTMLDivElement>();
  const [userPos, setUserPos] = useState<Pos | undefined>();

  useEffect(() => {
    if (!userPos) return;
    const { lng, lat } = userPos;
    setPos({ lng, lat, zoom: 10 });
    addMarker({ lng, lat });
  }, [userPos, setPos]);

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
      </div>
      <div ref={elementRef} className="h-full-minus-nav w-full" />
    </>
  );
}
