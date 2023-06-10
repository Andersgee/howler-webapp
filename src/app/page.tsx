import Link from "next/link";

import { db } from "#src/db";
import { IconArrowLink } from "#src/icons/ArrowLink";
import { formatDate } from "#src/utils/date";
import { hashidFromId } from "#src/utils/hashid";

import { NewEventForm } from "./event/NewEventForm";
import { MessagingTest } from "./messaging-test";

export default async function Page() {
  const events = await db
    .selectFrom("Event")
    .selectAll()
    .orderBy("id", "desc")
    .offset(0)
    .limit(10)
    .get({
      cache: "force-cache",
      next: {
        tags: ["events", "eventfirst10"],
      },
    });
  return (
    <main className="">
      <div className="container">
        <NewEventForm />

        <h2>Whats happening</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <Link
                className="block border-b py-4 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                prefetch={false}
                href={`/event/${hashidFromId(event.id)}`}
              >
                <div className="flex justify-between px-4">
                  <h3 className="capitalize-first flex-shrink truncate text-base font-normal">
                    {event.what || "anything"}
                  </h3>
                  <IconArrowLink className="text-neutral-500 dark:text-neutral-300" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <MessagingTest className="mt-4" />
      </div>
    </main>
  );
}
