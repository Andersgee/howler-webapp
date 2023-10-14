import { useEffect, useRef } from "react";
import { useStore } from "#src/store";

export function MapComponent() {
  const mapRef = useRef(null);
  const googleMaps = useStore.select.googleMaps();

  useEffect(() => {
    if (!googleMaps || !mapRef.current) return;
    googleMaps.render(mapRef.current);
  }, [googleMaps]);

  return <div ref={mapRef} className="h-full w-full" />;
}
