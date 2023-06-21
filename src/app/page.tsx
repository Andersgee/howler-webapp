import Link from "next/link";
import { ActivateNotificationsButton } from "#src/components/ActivateNotificationsButton";
import { CreateEventForm } from "#src/components/CreateEventForm";
import { IconArrowLink } from "#src/components/Icons";
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
    <main className="">
      <div className="container">
        <CreateEventForm />
        <div className="flex justify-center">
          <div>
            <h2>Latest 10 created howls</h2>
            <ul className="max-w-md">
              {events.map((event) => (
                <li key={event.id}>
                  <Link
                    className="block border-b py-4 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    prefetch={false}
                    href={`/event/${hashidFromId(event.id)}`}
                  >
                    <div className="flex items-center justify-between px-4">
                      <div>
                        <h3 className="capitalize-first shrink truncate text-base font-normal">
                          {event.what || "anything"}
                        </h3>
                        <p>
                          <WhenText date={event.when} />
                        </p>
                      </div>
                      <IconArrowLink className="text-neutral-500 dark:text-neutral-300" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <ActivateNotificationsButton />
          </div>
        </div>
      </div>
    </main>
  );
}
