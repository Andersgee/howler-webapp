"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMapDispatch } from "#src/context/GoogleMaps";

export function NavigationEvents() {
  const pathname = usePathname();
  //const searchParams = useSearchParams();
  const mapDispatch = useMapDispatch();

  useEffect(() => {
    //const url = `${pathname}?${searchParams}`;
    const paths = pathname.split("/");
    const isEventPage = paths.length === 3 && paths[1] === "event";
    if (!isEventPage) {
      mapDispatch({ type: "hide", name: "map" });
    }
  }, [pathname, mapDispatch]);

  return null;
}
