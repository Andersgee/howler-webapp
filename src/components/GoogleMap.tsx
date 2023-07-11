"use client";

import { useEffect, useRef } from "react";
import { useMapContext } from "#src/context/Map";

const MAP_ID = "google-maps-div";

export function GoogleMap() {
  const { isLoaded } = useMapContext();
  const mapRef = useRef<google.maps.Map>();

  useEffect(() => {
    if (!isLoaded || mapRef.current) return;

    async function initMap(): Promise<void> {
      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      mapRef.current = new Map(document.getElementById(MAP_ID) as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    }

    initMap();
  }, [isLoaded]);
  return (
    <>
      <style jsx global>{`
        html,
        body {
          height: 100%;
        }
      `}</style>
      <div id={MAP_ID} className="h-full-minus-nav w-full" />
    </>
  );
}
