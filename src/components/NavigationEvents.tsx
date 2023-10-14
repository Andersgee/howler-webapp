"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "#src/store";

export function NavigationEvents() {
  const pathname = usePathname();
  //const searchParams = useSearchParams();

  const googleMaps = useStore.select.googleMaps();
  const setShowGoogleMaps = useStore.select.setShowGoogleMaps();

  useEffect(() => {
    //const url = `${pathname}?${searchParams}`;
    const paths = pathname.split("/");
    //console.log({ paths }); // [ "", "test" ]
    const isEventPage = paths.length === 3 && paths[1] === "event";
    const isTestPage = paths[1] === "explore";
    const showMap = isEventPage || isTestPage;

    if (showMap) {
      //setShowGoogleMaps(true);
      //googleMaps?.clearMarkers();
    } else {
      setShowGoogleMaps(false);
      googleMaps?.clearMarkers();
    }
  }, [pathname, googleMaps, setShowGoogleMaps]);

  return null;
}
