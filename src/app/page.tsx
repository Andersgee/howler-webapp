import { jsonObjectFrom } from "kysely/helpers/mysql";
import Link from "next/link";
import { CreateEventForm } from "#src/components/CreateEventForm";
import { db } from "#src/db";
import { IconArrowLink } from "#src/icons/ArrowLink";
import { hashidFromId } from "#src/utils/hashid";
import { tagEvents } from "#src/utils/tags";
import { WhenText } from "./event/[hashid]/components";
import { NewEventForm } from "./event/NewEventForm";
import { MessagingTest } from "./messaging-test";
import { Stuff } from "./stuff";

//export const runtime = "edge";

export default async function Page() {
  const events = await db
    .selectFrom("Event")
    .selectAll()
    .select((eb) => [
      jsonObjectFrom(
        eb.selectFrom("User").select(["User.name", "User.image"]).whereRef("User.id", "=", "Event.creatorId")
      ).as("creator"),
    ])
    .orderBy("id", "desc")
    .offset(0)
    .limit(10)
    .get({
      cache: "force-cache",
      next: {
        tags: [tagEvents(), "eventslatest10"],
      },
    });

  return (
    <main className="">
      <div className="container">
        <CreateEventForm />
        <NewEventForm />
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
            <MessagingTest className="mt-4" />
            <Stuff />
          </div>
        </div>
      </div>
    </main>
  );
}
