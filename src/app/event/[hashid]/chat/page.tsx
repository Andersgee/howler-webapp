import { notFound } from "next/navigation";
import { SigninButtons } from "#src/components/buttons/SigninButtons";
import { EventChat } from "#src/components/EventChat";
import { MainShell } from "#src/components/MainShell";
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

  const location = await getEventLocation({ eventId });
  if (location?.placeName) {
    return seo({
      title: `${event.what || "anything"} | chat | Howler`,
      description: `where: ${location.placeName}, who: ${event.who || "anyone"}`,
      url: `/event/${params.hashid}`,
      image: "/icons/favicon-512x512.png",
    });
  }

  return seo({
    title: `${event.what || "anything"} | chat | Howler`,
    description: `where: ${event.where || "anywhere"}, who: ${event.who || "anyone"}`,
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

  if (!user) {
    return (
      <MainShell>
        <h1>Sign in and join event to chat</h1>
        <SigninButtons />
      </MainShell>
    );
  }

  const hasJoinedEvent = await getHasJoinedEvent({ eventId, userId: user.id });

  return <EventChat eventId={eventId} userId={user.id} initialIsJoined={hasJoinedEvent} />;
}
