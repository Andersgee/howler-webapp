"use client";

import Link from "next/link";
import { boundsContains } from "#src/components/GoogleMap/utils";
import { IconArrowLink } from "#src/components/Icons";
import { WhenText } from "#src/components/WhenText";
import { useLocationsInView } from "#src/hooks/useLocationsInView";
import { useStore } from "#src/store";
import { hashidFromId } from "#src/utils/hashid";

type Props = {
  className?: string;
};

export function EventsInViewList({ className }: Props) {
  const events = useLocationsInView();
  const mapBounds = useStore.select.mapBounds();

  return (
    <ul className="max-w-md">
      {events
        ?.filter((event) =>
          boundsContains({ ne: mapBounds.ne, sw: mapBounds.sw, p: { lng: event.lng, lat: event.lat } })
        )
        .map((event) => (
          <li key={event.id}>
            <Link
              className="hover:bg-secondary block border-b px-3 py-4 transition-colors"
              prefetch={false}
              href={`/event/${hashidFromId(event.id)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="capitalize-first shrink text-base font-medium">{event.what || "anything"}</h3>
                  <p>
                    <WhenText date={event.when} />
                  </p>
                </div>
                <IconArrowLink className="shrink-0" />
              </div>
            </Link>
          </li>
        ))}
    </ul>
  );
}
