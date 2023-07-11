"use client";

import { useEffect, useRef } from "react";

const MAP_ID = "google-maps-div";

export function GoogleMap() {
  const mapRef = useRef<google.maps.Map>();
  useEffect(() => {
    if (mapRef.current) return;

    async function initMap(): Promise<void> {
      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      mapRef.current = new Map(document.getElementById(MAP_ID) as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    }

    initMap();
  }, []);
  return (
    <>
      <style jsx global>{`
        html,
        body {
          height: 100%;
        }
      `}</style>
      <div id={MAP_ID} className="h-full w-full" />
    </>
  );
}
