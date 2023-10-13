"use client";

import Script from "next/script";
import { useStore } from "#src/store";
import { absUrl } from "#src/utils/url";

export function GoogleMapsScript() {
  const initGoogleMaps = useStore.select.initGoogleMaps();
  return (
    <Script
      src={absUrl("/google-maps.js")} //"https://howler.andyfx.net/google-maps.js"
      strategy="lazyOnload"
      onLoad={() => initGoogleMaps()}
    />
  );
}
