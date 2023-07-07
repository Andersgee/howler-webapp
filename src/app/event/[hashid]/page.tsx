import { notFound } from "next/navigation";
import { EditEventButton } from "#src/components/buttons/EditEventButton";
import { JoinEventButton } from "#src/components/buttons/JoinEventButton";
import { ShareButton } from "#src/components/buttons/ShareButton";
import { EventChat } from "#src/components/EventChat";
import { EventInfo } from "#src/components/EventInfo";
import { idFromHashid } from "#src/utils/hashid";
import { seo } from "#src/utils/seo";
import { getEventInfo, getHasJoinedEvent } from "#src/utils/tags";
import { getUserFromCookie } from "#src/utils/token";
import type { PageProps } from "#src/utils/typescript";

export async function generateMetadata({ params }: PageProps) {
  const eventId = idFromHashid(params.hashid);
  if (!eventId) notFound();
  const event = await getEventInfo({ eventId });
  if (!event) notFound();

  return seo({
    title: `${event.what} | Event | Howler`,
    description: `where: ${event.where} who: ${event.who} info: ${event.info}`,
    url: `/event/${params.hashid}`,
    image: "/icons/favicon-512x512.png",
  });
}

//export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps) {
  const eventId = idFromHashid(params.hashid);
  if (!eventId) notFound();
  const event = await getEventInfo({ eventId });
  if (!event) notFound();
  const user = await getUserFromCookie();
  const hasJoinedEvent = user ? await getHasJoinedEvent({ eventId, userId: user.id }) : false;

  return (
    <>
      <div className="container flex justify-center">
        <div className="">
          <EventInfo eventId={eventId} initialEventInfo={event} />
          <div className="my-2 flex justify-center">
            <JoinEventButton eventId={eventId} initialIsJoined={hasJoinedEvent} />
          </div>
          {event.creatorId === user?.id && (
            <div>
              <EditEventButton eventId={eventId} />
            </div>
          )}
          <div>
            <ShareButton title={event.what} />
          </div>
        </div>
      </div>
      {user && <EventChat eventId={eventId} userId={user.id} initialIsJoined={hasJoinedEvent} />}
    </>
  );
}
