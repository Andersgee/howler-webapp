"use client";

import { useEffect } from "react";
import { GoogleMap } from "#src/components/GoogleMap";
import { MainShellFull } from "#src/components/MainShell";
import { useStore } from "#src/store";

export default function Page() {
  const googleMaps = useStore.select.googleMaps();

  useEffect(() => {
    if (!googleMaps) return;
    googleMaps.setExploreMarkers(locations);
  }, [googleMaps]);
  return (
    <MainShellFull>
      <div className="h-96 w-full">
        <GoogleMap />
      </div>
      <button
        onClick={() => {
          googleMaps?.setExploreMarkers(locations2);
        }}
      >
        change locations
      </button>
    </MainShellFull>
  );
}

const locations = [
  { what: "a", lat: -31.56391, lng: 147.154312 },
  { what: "b", lat: -33.718234, lng: 150.363181 },
  { what: "c", lat: -33.727111, lng: 150.371124 },
  { what: "d", lat: -33.848588, lng: 151.209834 },
  { what: "e", lat: -33.851702, lng: 151.216968 },
  { what: "f", lat: -34.671264, lng: 150.863657 },
  { what: "g", lat: -35.304724, lng: 148.662905 },
  { what: "h", lat: -36.817685, lng: 175.699196 },
  { what: "i", lat: -36.828611, lng: 175.790222 },
  { what: "j", lat: -37.75, lng: 145.116667 },
  { what: "k", lat: -37.759859, lng: 145.128708 },
  { what: "l", lat: -37.765015, lng: 145.133858 },
  { what: "m", lat: -37.770104, lng: 145.143299 },
  { what: "n", lat: -37.7737, lng: 145.145187 },
  { what: "o", lat: -37.774785, lng: 145.137978 },
  { what: "p", lat: -37.819616, lng: 144.968119 },
  { what: "q", lat: -38.330766, lng: 144.695692 },
  { what: "r", lat: -39.927193, lng: 175.053218 },
  { what: "s", lat: -41.330162, lng: 174.865694 },
  { what: "t", lat: -42.734358, lng: 147.439506 },
  { what: "u", lat: -42.734358, lng: 147.501315 },
  { what: "v", lat: -42.735258, lng: 147.438 },
  { what: "x", lat: -43.999792, lng: 170.463352 },
];

const locations2 = [
  { what: "a", lat: -30.56391, lng: 147.154312 },
  { what: "b", lat: -32.718234, lng: 150.363181 },
  { what: "c", lat: -32.727111, lng: 150.371124 },
  { what: "d", lat: -32.848588, lng: 151.209834 },
  { what: "e", lat: -32.851702, lng: 151.216968 },
  { what: "f", lat: -33.671264, lng: 150.863657 },
  { what: "g", lat: -34.304724, lng: 148.662905 },
  { what: "h", lat: -35.817685, lng: 175.699196 },
  { what: "i", lat: -35.828611, lng: 175.790222 },
  { what: "j", lat: -36.75, lng: 145.116667 },
  { what: "k", lat: -36.759859, lng: 145.128708 },
  { what: "l", lat: -36.765015, lng: 145.133858 },
  { what: "m", lat: -36.770104, lng: 145.143299 },
  { what: "n", lat: -36.7737, lng: 145.145187 },
  { what: "o", lat: -36.774785, lng: 145.137978 },
  { what: "p", lat: -36.819616, lng: 144.968119 },
  { what: "q", lat: -37.330766, lng: 144.695692 },
  { what: "r", lat: -38.927193, lng: 175.053218 },
  { what: "s", lat: -40.330162, lng: 174.865694 },
  { what: "t", lat: -41.734358, lng: 147.439506 },
  { what: "u", lat: -41.734358, lng: 147.501315 },
  { what: "v", lat: -41.735258, lng: 147.438 },
  { what: "x", lat: -41.999792, lng: 170.463352 },
];
