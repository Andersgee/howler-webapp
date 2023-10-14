"use client";

import { MainShell } from "#src/components/MainShell";
import { useStore } from "#src/store";

export default function Page() {
  const tileIdsInView = useStore.select.tileIdsInView();
  return (
    <MainShell>
      <ul>
        {tileIdsInView.map((tileId, i) => (
          <li key={tileId}>
            i: {i}: tileId: {tileId}
          </li>
        ))}
      </ul>
    </MainShell>
  );
}
