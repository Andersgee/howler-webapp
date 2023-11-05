import Link from "next/link";
import { notFound } from "next/navigation";
import { apiRsc, apiRscPublic } from "#src/api/apiRsc";
import { DeleteEventButton } from "#src/components/buttons/DeleteEventButton";
import { EditEventButton } from "#src/components/buttons/EditEventButton";
import { JoinEventButton } from "#src/components/buttons/JoinEventButton";
import { ShareButton } from "#src/components/buttons/ShareButton";
import { EventInfo } from "#src/components/EventInfo";
import { IconChat } from "#src/components/Icons";
import { MainShell } from "#src/components/MainShell";
import { Button } from "#src/components/ui/Button";
import { idFromHashid } from "#src/utils/hashid";
import { seo } from "#src/utils/seo";
import type { PageProps } from "#src/utils/typescript";

export async function generateMetadata({ params }: PageProps) {
  const eventId = idFromHashid(params.hashid);
  if (!eventId) notFound();
  const event = await apiRscPublic.event.info.fetch({ eventId });
  if (!event) notFound();

  const location = await apiRscPublic.event.location.fetch({ eventId });

  return seo({
    title: `${event.what || "anything"} | Howler`,
    description: `where: ${location?.placeName || event.where || "anywhere"}, who: ${event.who || "anyone"}`,
    url: `/event/${params.hashid}`,
    image: "/howler.png",
  });
}

export default async function Page({ params }: PageProps) {
  const eventId = idFromHashid(params.hashid);
  if (!eventId) notFound();
  const { api, user } = await apiRsc();

  const event = await api.event.info.fetch({ eventId });
  if (!event) notFound();
  const location = await api.event.location.fetch({ eventId });
  const isJoined = user ? await api.event.isJoined.fetch({ eventId }) : false;
  const isCreator = user?.id === event.creatorId;

  return (
    <MainShell>
      <EventInfo eventId={eventId} initialEventInfo={event} initialEventLocation={location} isCreator={isCreator} />

      {!isCreator && (
        <div className="my-4 flex justify-center">
          <JoinEventButton eventId={eventId} initialIsJoined={isJoined} />
        </div>
      )}

      <div className="my-2 flex gap-2">
        {isCreator && <EditEventButton eventId={eventId} initialEventInfo={event} />}
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
    </MainShell>
  );
}
