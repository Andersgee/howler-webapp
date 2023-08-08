import { useCallback, useRef } from "react";
import { useMapContext } from "#src/context/Map";

//https://console.cloud.google.com/google/maps-apis/studio/maps
const TEST_MAP_ID = "478ad7a3d9f73ca4";

export function useGoogleMaps<T extends HTMLElement>() {
  const googlemaps = useRef<google.maps.Map | null>(null);

  const advancedMarker = useRef<typeof google.maps.marker.AdvancedMarkerElement | null>(null);

  const { isLoaded } = useMapContext();

  const elementRef = useCallback(
    (element: T) => {
      if (!isLoaded || !element || googlemaps.current) return;

      async function initMap(): Promise<void> {
        //load relevant libraries
        const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

        advancedMarker.current = AdvancedMarkerElement;
        //instantiate
        const map = new Map(element, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
          mapId: TEST_MAP_ID, //required for AdvancedMarkerElement
        });

        //const marker = new advancedMarker.current({
        //  map,
        //  position: { lat: 37.4239163, lng: -122.0947209 },
        //});

        //marker.position = null //remove like this?

        googlemaps.current = map;
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

  //https://developers.google.com/maps/documentation/javascript/markers
  const addMarker = useCallback(({ lng, lat }: { lng: number; lat: number }) => {
    if (!googlemaps.current || !advancedMarker.current) return;

    //const marker = new google.maps.Marker({
    //  position: { lng, lat },
    //  title: "This is you!",
    //});
    //marker.setMap(googlemaps.current); //add maker to map

    const marker = new advancedMarker.current({
      map: googlemaps.current,
      position: { lat, lng: lng + 0.1 },
      title: "This is you (advanced marker)",
    });
  }, []);

  return { elementRef, googlemaps, setPos, addMarker };
}
