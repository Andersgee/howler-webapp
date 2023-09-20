import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteEventButton } from "#src/components/buttons/DeleteEventButton";
import { EditEventButton } from "#src/components/buttons/EditEventButton";
import { JoinEventButton } from "#src/components/buttons/JoinEventButton";
import { ShareButton } from "#src/components/buttons/ShareButton";
import { EventInfo } from "#src/components/EventInfo";
import { IconChat } from "#src/components/Icons";
import { Button } from "#src/components/ui/Button";
import { idFromHashid } from "#src/utils/hashid";
import { seo } from "#src/utils/seo";
import { getEventInfo, getEventLocation, getHasJoinedEvent } from "#src/utils/tags";
import { getUserFromCookie } from "#src/utils/token";
import type { PageProps } from "#src/utils/typescript";

export async function generateMetadata({ params }: PageProps) {
  const eventId = idFromHashid(params.hashid);
  if (!eventId) notFound();
  const event = await getEventInfo({ eventId });
  if (!event) notFound();

  return seo({
    title: `${event.what || "anything"} | Howler`,
    description: `howl by ${event.creator.name}, with who: ${event.who || "anyone"}`,
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
  const location = await getEventLocation({ eventId });

  const user = await getUserFromCookie();
  const hasJoinedEvent = user ? await getHasJoinedEvent({ eventId, userId: user.id }) : false;
  const isCreator = user?.id === event.creatorId;
  return (
    <>
      <div className="container flex justify-center">
        <div className="">
          <EventInfo eventId={eventId} initialEventInfo={event} initialEventLocation={location} isCreator={isCreator} />
          <div className="my-4 flex justify-center">
            <JoinEventButton eventId={eventId} initialIsJoined={hasJoinedEvent} />
          </div>
          <div className="flex gap-2">
            {isCreator && (
              <EditEventButton eventId={eventId} initialEventInfo={event} initialEventLocation={location} />
            )}
            <ShareButton title={event.what} />
            {user && (
              <Button variant="secondary" asChild>
                <Link href={`/event/${params.hashid}/chat`}>
                  <IconChat /> <span className="ml-2">Chat</span>
                </Link>
              </Button>
            )}
          </div>
          {isCreator && (
            <div className="my-8">
              <DeleteEventButton eventId={event.id} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
