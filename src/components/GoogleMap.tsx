"use client";

import { useEffect, useRef, useState } from "react";
import { useMapContext } from "#src/context/Map";
import { LocateButton, type Pos } from "./buttons/LocateButton";

const MAP_ID = "google-maps-div";

export function GoogleMap() {
  const { isLoaded } = useMapContext();
  const mapRef = useRef<google.maps.Map>();
  const markerRef = useRef<typeof google.maps.marker.AdvancedMarkerElement>();

  const [userPos, setUserPos] = useState<Pos | undefined>();

  useEffect(() => {
    if (!mapRef.current || !userPos || !markerRef.current) return;

    mapRef.current.setCenter(userPos);

    const marker = new markerRef.current({
      map: mapRef.current,
      position: userPos,
      title: "You",
    });
  }, [userPos]);

  useEffect(() => {
    if (!isLoaded || mapRef.current) return;

    async function initMap(): Promise<void> {
      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      mapRef.current = new Map(document.getElementById(MAP_ID) as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });

      const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
      markerRef.current = AdvancedMarkerElement;

      //const position = { lat: -25.344, lng: 131.031 };

      // const marker = new AdvancedMarkerElement({
      //   map: mapRef.current,
      //   position: position,
      //   title: "Uluru",
      // });
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
      <LocateButton onLocated={(pos) => setUserPos(pos)} />
      <div id={MAP_ID} className="h-full-minus-nav w-full" />
    </>
  );
}
