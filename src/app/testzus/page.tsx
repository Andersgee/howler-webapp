"use client";

import { MainShell } from "#src/components/MainShell";
import { useStore } from "#src/store";

export default function Page() {
  const bears = useStore.select.bears();
  const dialogAction = useStore.select.dialogAction();
  const tileIdsInView = useStore.select.tileIdsInView();
  return (
    <MainShell>
      <div>bears: {bears}</div>
      <button className="bg-green-500 px-3 py-2" onClick={() => dialogAction({ type: "toggle", name: "signin" })}>
        toggle signin dialog
      </button>

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
