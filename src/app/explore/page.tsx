"use client";

import Link from "next/link";
import { GoogleMap } from "#src/components/GoogleMap";
import { IconArrowLink } from "#src/components/Icons";
import { MainShellFull } from "#src/components/MainShell";
import { WhenText } from "#src/components/WhenText";
import { useLocationsInView } from "#src/hooks/useLocationsInView";
import { hashidFromId } from "#src/utils/hashid";

export default function Page() {
  const events = useLocationsInView();
  return (
    <MainShellFull>
      <div className="h-96 w-full">
        <GoogleMap />
      </div>
      <ul className="max-w-md">
        {events?.map((event) => (
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
    </MainShellFull>
  );
}
