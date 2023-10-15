"use client";

import Link from "next/link";
import { GoogleMap } from "#src/components/GoogleMap";
import { IconArrowLink } from "#src/components/Icons";
import { MainShellFull } from "#src/components/MainShell";
import { useLocationsInView } from "#src/hooks/useLocationsInView";
import { useStore } from "#src/store";
import { hashidFromId } from "#src/utils/hashid";

export default function Page() {
  //const tileIdsInView = useStore.select.tileIdsInView();
  const locations = useLocationsInView();
  return (
    <MainShellFull>
      <div className="h-96 w-full">
        <GoogleMap />
      </div>
      <ul className="max-w-md">
        {locations?.map((location) => (
          <li key={location.id}>
            <Link
              className="hover:bg-secondary block border-b px-3 py-4 transition-colors"
              prefetch={false}
              href={`/event/${hashidFromId(location.eventId)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="capitalize-first shrink text-base font-medium">{location.placeName || "anywhere"}</h3>
                </div>
                <IconArrowLink className="shrink-0" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </MainShellFull>
  );
}
