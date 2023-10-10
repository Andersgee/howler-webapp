"use client";

import { MainShell } from "#src/components/MainShell";
import { googleMaps } from "#src/context/GoogleMaps/google-maps";
import { increaseBears, useBearStore } from "#src/hooks/store";

export default function Page() {
  const { bears } = useBearStore();
  return (
    <MainShell>
      <div>bears: {bears}</div>
      <button className="bg-blue-500 px-3 py-2" onClick={() => increaseBears(2)}>
        increase bears by 2
      </button>
      <button
        className="bg-purple-500 px-3 py-2"
        onClick={() => {
          if (!googleMaps.isReady) return;

          googleMaps.testReactStateUpdate(3);
        }}
      >
        increase bears by 3 via googleMaps method
      </button>
    </MainShell>
  );
}
