"use client";

import { GoogleMap } from "#src/components/GoogleMap";
import { MainShellFull } from "#src/components/MainShell";
import { useStore } from "#src/store";

export default function Page() {
  const tileIdsInView = useStore.select.tileIdsInView();
  return (
    <MainShellFull>
      <div className="h-96 w-full">
        <GoogleMap />
      </div>
      <ul>
        {tileIdsInView.map((tileId, i) => (
          <li key={tileId}>
            i: {i}: tileId: {tileId}
          </li>
        ))}
      </ul>
    </MainShellFull>
  );
}
