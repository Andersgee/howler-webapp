"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMapContext, useMapDispatch } from "#src/context/GoogleMaps";
import { googleMaps } from "#src/context/GoogleMaps/google-maps";

export function NavigationEvents() {
  const pathname = usePathname();
  //const searchParams = useSearchParams();
  const mapDispatch = useMapDispatch();
  const { googleMapIsReady } = useMapContext();

  useEffect(() => {
    mapDispatch({ type: "show", name: "map" }); //debug

    //const url = `${pathname}?${searchParams}`;
    const paths = pathname.split("/");
    const isEventPage = paths.length === 3 && paths[1] === "event";

    /*
    if (!isEventPage) {
      mapDispatch({ type: "hide", name: "map" });
      if (googleMapIsReady) {
        googleMaps.clearMarkers();
      }
    }
    */
  }, [pathname, mapDispatch, googleMapIsReady]);

  return null;
}
