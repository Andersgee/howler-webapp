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
    const isEventPage = paths.length === 3 && paths[1] === "event";

    if (!isEventPage) {
      setShowGoogleMaps(false);
      googleMaps?.clearMarkers();
    }
  }, [pathname, googleMaps, setShowGoogleMaps]);

  return null;
}
