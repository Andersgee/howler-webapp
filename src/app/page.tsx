import Link from "next/link";
import { ActivateNotificationsButton } from "#src/components/buttons/ActivateNotificationsButton";
import { CreateEventForm } from "#src/components/CreateEventForm";
import { IconArrowLink } from "#src/components/Icons";
import { MainShell } from "#src/components/MainShell";
import { buttonStylesSecondary } from "#src/components/ui/Button";
import { WhenText } from "#src/components/WhenText";
import { hashidFromId } from "#src/utils/hashid";
import { seo } from "#src/utils/seo";
import { getEventsLatest10 } from "#src/utils/tags";

//export const runtime = "edge";

export const metadata = seo({
  title: "Howler",
  description:
    "Looking for something to do in real life? A place to quickly find/plan stuff to do with friends, or with anyone really.",
  url: "/",
  image: "/icons/favicon-512x512.png",
});

export default async function Page() {
  const events = await getEventsLatest10();

  return (
    <MainShell>
      <CreateEventForm />
      <div className="mt-10 flex justify-center">
        <div>
          <h2 className="text-center">Latest howls</h2>
          <ul className="max-w-md">
            {events.map((event) => (
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
          <ActivateNotificationsButton />
          <Link href="/explore" className={buttonStylesSecondary}>
            Explore
          </Link>
        </div>
      </div>
    </MainShell>
  );
}
