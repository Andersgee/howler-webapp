"use client";

import { useEffect } from "react";
import { GoogleMap } from "#src/components/GoogleMap";
import { MainShellFull } from "#src/components/MainShell";
import { useStore } from "#src/store";

export default function Page() {
  const googleMaps = useStore.select.googleMaps();

  useEffect(() => {
    if (!googleMaps) return;
    googleMaps.setMarkerCluster(locations);
  }, [googleMaps]);
  return (
    <MainShellFull>
      <div className="h-96 w-full">
        <GoogleMap />
      </div>
      <button
        onClick={() => {
          googleMaps?.setMarkerCluster(locations2);
        }}
      >
        change locations
      </button>
    </MainShellFull>
  );
}

const locations = [
  { label: "a", lat: -31.56391, lng: 147.154312 },
  { label: "b", lat: -33.718234, lng: 150.363181 },
  { label: "c", lat: -33.727111, lng: 150.371124 },
  { label: "d", lat: -33.848588, lng: 151.209834 },
  { label: "e", lat: -33.851702, lng: 151.216968 },
  { label: "f", lat: -34.671264, lng: 150.863657 },
  { label: "g", lat: -35.304724, lng: 148.662905 },
  { label: "h", lat: -36.817685, lng: 175.699196 },
  { label: "i", lat: -36.828611, lng: 175.790222 },
  { label: "j", lat: -37.75, lng: 145.116667 },
  { label: "k", lat: -37.759859, lng: 145.128708 },
  { label: "l", lat: -37.765015, lng: 145.133858 },
  { label: "m", lat: -37.770104, lng: 145.143299 },
  { label: "n", lat: -37.7737, lng: 145.145187 },
  { label: "o", lat: -37.774785, lng: 145.137978 },
  { label: "p", lat: -37.819616, lng: 144.968119 },
  { label: "q", lat: -38.330766, lng: 144.695692 },
  { label: "r", lat: -39.927193, lng: 175.053218 },
  { label: "s", lat: -41.330162, lng: 174.865694 },
  { label: "t", lat: -42.734358, lng: 147.439506 },
  { label: "u", lat: -42.734358, lng: 147.501315 },
  { label: "v", lat: -42.735258, lng: 147.438 },
  { label: "x", lat: -43.999792, lng: 170.463352 },
];

const locations2 = [
  { label: "a", lat: -30.56391, lng: 147.154312 },
  { label: "b", lat: -32.718234, lng: 150.363181 },
  { label: "c", lat: -32.727111, lng: 150.371124 },
  { label: "d", lat: -32.848588, lng: 151.209834 },
  { label: "e", lat: -32.851702, lng: 151.216968 },
  { label: "f", lat: -33.671264, lng: 150.863657 },
  { label: "g", lat: -34.304724, lng: 148.662905 },
  { label: "h", lat: -35.817685, lng: 175.699196 },
  { label: "i", lat: -35.828611, lng: 175.790222 },
  { label: "j", lat: -36.75, lng: 145.116667 },
  { label: "k", lat: -36.759859, lng: 145.128708 },
  { label: "l", lat: -36.765015, lng: 145.133858 },
  { label: "m", lat: -36.770104, lng: 145.143299 },
  { label: "n", lat: -36.7737, lng: 145.145187 },
  { label: "o", lat: -36.774785, lng: 145.137978 },
  { label: "p", lat: -36.819616, lng: 144.968119 },
  { label: "q", lat: -37.330766, lng: 144.695692 },
  { label: "r", lat: -38.927193, lng: 175.053218 },
  { label: "s", lat: -40.330162, lng: 174.865694 },
  { label: "t", lat: -41.734358, lng: 147.439506 },
  { label: "u", lat: -41.734358, lng: 147.501315 },
  { label: "v", lat: -41.735258, lng: 147.438 },
  { label: "x", lat: -41.999792, lng: 170.463352 },
];
