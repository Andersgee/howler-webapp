"use client";

import Link from "next/link";
import { LocateButton } from "#src/components/buttons/LocateButton";
import { GoogleMap } from "#src/components/GoogleMap";
import { useLocationsInView } from "#src/hooks/useLocationsInView";
import { useStore } from "#src/store";
import { hashidFromId } from "#src/utils/hashid";
import { WhenText } from "./WhenText";

type Props = {
  className?: string;
};

export function ExploreMap({ className }: Props) {
  return (
    <div className={className}>
      <InfoWindowContents />
      <div className="h-96 w-full">
        <GoogleMap />
      </div>
      <Locate />
    </div>
  );
}

function Locate() {
  const googleMaps = useStore.select.googleMaps();
  return <LocateButton label="Go to my position" onLocated={(p) => googleMaps?.setPos({ ...p, zoom: 10 })} />;
}

/**
 * a bunch of hidden divs that googleMaps can select by id and draw in infowindows.
 */
function InfoWindowContents() {
  const events = useLocationsInView();
  //const mapBounds = useStore.select.mapBounds();

  return (
    <>
      {events?.map((event) => (
        <div key={event.id} id={String(event.id)} className="sr-only bg-white">
          <Link
            className="block px-2 py-3 transition-colors hover:bg-neutral-100"
            prefetch={false}
            href={`/event/${hashidFromId(event.id)}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="capitalize-first shrink text-base font-medium text-black">{event.what || "anything"}</h3>
                <p className="text-neutral-800">
                  <WhenText date={event.when} />
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
}
