import Link from "next/link";
import { db } from "src/db";
import { formatDate } from "src/utils/date";
import { hashidFromId } from "src/utils/hashid";
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
        tags: ["eventfirst10"],
      },
    });
  return (
    <main className="">
      <div className="container bg-orange-400">
        <div>hello</div>
        <MessagingTest />
        <div>
          <Link href="/event" className="px-3 py-2 bg-blue-500">
            go to event
          </Link>
        </div>

        <div>
          <ul>
            {events.map((event) => (
              <Link prefetch={false} key={event.id} href={`/event/${hashidFromId(event.id)}`}>
                <li>{`what:${event.what} when:${formatDate(event.when)}`}</li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
