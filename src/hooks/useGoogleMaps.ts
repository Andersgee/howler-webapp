import { useCallback, useRef } from "react";
import { useMapContext } from "#src/context/Map";

export function useGoogleMaps<T extends HTMLElement>() {
  const googlemaps = useRef<google.maps.Map | null>(null);
  const { isLoaded } = useMapContext();

  const elementRef = useCallback(
    (element: T) => {
      if (!isLoaded || !element || googlemaps.current) return;

      async function initMap(): Promise<void> {
        const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        googlemaps.current = new Map(element, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
      }

      initMap();
    },
    [isLoaded]
  );

  const setPos = useCallback(({ lng, lat, zoom }: { lng: number; lat: number; zoom: number }) => {
    if (!googlemaps.current) return;

    googlemaps.current.setCenter({ lng, lat });
    googlemaps.current.setZoom(zoom);
  }, []);

  return { elementRef, googlemaps, setPos };
}
