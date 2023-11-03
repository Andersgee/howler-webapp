"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LocateButton } from "#src/components/buttons/LocateButton";
import { GoogleMap } from "#src/components/GoogleMap";
import { api } from "#src/hooks/api";
import { useLocationsInView } from "#src/hooks/useLocationsInView";
import { useStore } from "#src/store";
import { hashidFromId } from "#src/utils/hashid";
import { imageSizes } from "#src/utils/image-sizes";
import { IconArrowLink, IconClose } from "./Icons";
import { WhenText } from "./WhenText";

type Props = {
  className?: string;
};

export function ExploreMap({ className }: Props) {
  useLocationsInView();

  return (
    <div className={className}>
      {/*<InfoWindowContents />*/}
      <div className="relative h-96 w-full">
        <EventDrawer />
        <GoogleMap />
      </div>

      <Locate />
      <PortaledEventDrawer />
    </div>
  );
}

/** cant draw on top of google maps div, unless content is inside it */
function PortaledEventDrawer() {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const googleMaps = useStore.use.googleMaps();

  useEffect(() => {
    if (!googleMaps) return;
    const myGoogleMapDiv = document.getElementById("my-google-map-div")?.getElementsByTagName("div")[0];

    if (myGoogleMapDiv) {
      setNode(myGoogleMapDiv);
    }
  }, [googleMaps]);

  if (node === null) {
    return null;
  }

  return createPortal(<EventDrawer />, node);
}

function EventDrawer() {
  const clickedEventId = useStore.use.mapClickedEventId();
  const mapSetClickedEventId = useStore.use.mapSetClickedEventId();

  const { data: event } = api.event.info.useQuery(
    { eventId: clickedEventId || 0 },
    { enabled: clickedEventId !== null }
  );

  if (!event || clickedEventId == null) return <div className="absolute"></div>;

  return (
    <div className="absolute z-50 w-64 bg-neutral-100 text-neutral-900 shadow-lg shadow-neutral-500">
      <div className="flex justify-end">
        <button onClick={() => mapSetClickedEventId(null)}>
          <IconClose className="rounded-full p-2 hover:bg-neutral-200" />
        </button>
      </div>
      {event.image ? (
        <Image
          src={event.image}
          alt="event"
          quality={100}
          sizes={imageSizes("w-64")}
          className="h-auto w-64"
          width={256}
          height={Math.round(256 / (event.imageAspectRatio ?? 1))}
          //placeholder={imagePlaceholder(256, h256)}
        />
      ) : (
        <div className="flex h-36 w-64 items-center justify-center border border-neutral-500 text-neutral-400">
          creator didnt add any image
        </div>
      )}

      <div className="m-3">
        <Link
          href={`/event/${hashidFromId(event.id)}`}
          className="my-3 flex justify-between rounded-sm bg-blue-400 px-3 py-2 text-lg font-bold hover:bg-blue-500"
        >
          {event.what || "anything"}
          <IconArrowLink />
        </Link>

        <div className="text-xs">
          <WhenText date={event.when} />
        </div>
        <div className="my-2 flex items-center text-xs">
          <div>created by </div>
          <Link href={`/u/${hashidFromId(event.creator.id)}`}>
            <div className="relative h-8 w-8">
              <Image
                src={event.creator.image || ""}
                alt={"creator"}
                sizes={imageSizes("w-8")}
                fill
                className="rounded-full object-contain"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Locate() {
  const googleMaps = useStore.use.googleMaps();
  return <LocateButton label="Go to my position" onLocated={(p) => googleMaps?.setPos({ ...p, zoom: 10 })} />;
}

/**
 * a bunch of hidden divs that googleMaps can select by id and draw in infowindows.
 */
function InfoWindowContents() {
  const events = useLocationsInView();
  //const mapBounds = useStore.select.mapBounds();

  return (
    <div>
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
    </div>
  );
}
