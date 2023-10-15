"use client";

import { GoogleMap } from "#src/components/GoogleMap";
import { MainShellFull } from "#src/components/MainShell";
import { EventsInViewList } from "./EventsInViewList";

export default function Page() {
  return (
    <MainShellFull>
      <div className="h-96 w-full">
        <GoogleMap />
      </div>
      <EventsInViewList />
    </MainShellFull>
  );
}
