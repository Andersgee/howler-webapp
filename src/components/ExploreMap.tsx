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
import { WhenText } from "./WhenText";

type Props = {
  className?: string;
};

export function ExploreMap({ className }: Props) {
  useLocationsInView();

  return (
    <div className={className}>
      <div className="relative h-96 w-full">
        <GoogleMap />
      </div>

      <Locate />
      <PortaledInfowindowContent />
    </div>
  );
}

function PortaledInfowindowContent() {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const googleMaps = useStore.use.googleMaps();

  useEffect(() => {
    if (!googleMaps?.infoWindowElement) return;
    //const element = document.getElementById("my-google-map-div")?.getElementsByTagName("div")[0];
    const element = googleMaps.infoWindowElement;

    if (element) {
      setNode(element);
    }
  }, [googleMaps?.infoWindowElement]);

  if (node === null) {
    return null;
  }

  return createPortal(<InfowindowContent />, node);
}

function InfowindowContent() {
  const clickedEventId = useStore.use.mapClickedEventId();
  //const mapSetClickedEventId = useStore.use.mapSetClickedEventId();

  const { data: event } = api.event.info.useQuery(
    { eventId: clickedEventId || 0 },
    { enabled: clickedEventId !== null }
  );

  if (!event || clickedEventId == null) return <div className="absolute"></div>;

  return (
    <Link href={`/event/${hashidFromId(event.id)}`} className="group block w-48 text-neutral-900 hover:bg-neutral-200">
      <h2 className="text-center text-neutral-900">{event.what}</h2>
      {event.image ? (
        <Image
          src={event.image}
          alt="event"
          quality={100}
          sizes={imageSizes("w-64")}
          className="h-auto w-48 group-hover:opacity-50"
          width={256}
          height={Math.round(256 / (event.imageAspectRatio ?? 1))}
        />
      ) : (
        <div className="flex h-10 w-48 items-center justify-center text-neutral-800">no image added</div>
      )}

      <div className="">
        <div className="text-xs">
          <WhenText date={event.when} />
        </div>
        <div className="mt-2 flex items-center text-xs">
          <div>created by </div>

          <div className="relative h-8 w-8">
            <Image
              src={event.creator.image || ""}
              alt={"creator"}
              sizes={imageSizes("w-8")}
              fill
              className="rounded-full object-contain"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function Locate() {
  const googleMaps = useStore.use.googleMaps();
  return <LocateButton label="Go to my position" onLocated={(p) => googleMaps?.setPos({ ...p, zoom: 10 })} />;
}
