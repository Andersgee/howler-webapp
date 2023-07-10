import { notFound } from "next/navigation";
import { SigninButtons } from "#src/components/buttons/SigninButtons";
import { EventChat } from "#src/components/EventChat";
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
    title: `${event.what} | chat | Howler`,
    description: `where: ${event.where} who: ${event.who} info: ${event.info}`,
    url: `/event/${params.hashid}/chat`,
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
      <div>
        <h1>Sign in and join event to chat</h1>
        <SigninButtons />
      </div>
    );
  }

  const hasJoinedEvent = await getHasJoinedEvent({ eventId, userId: user.id });

  return <EventChat eventId={eventId} userId={user.id} initialIsJoined={hasJoinedEvent} />;
}
