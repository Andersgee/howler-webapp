import { notFound } from "next/navigation";
import { apiRsc, apiRscPublic } from "#src/api/apiRsc";
import { SigninButtons } from "#src/components/buttons/SigninButtons";
import { EventChat } from "#src/components/EventChat";
import { MainShell } from "#src/components/MainShell";
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

//export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps) {
  const eventId = idFromHashid(params.hashid);
  if (!eventId) notFound();

  const { api, user } = await apiRsc();
  const event = await apiRscPublic.event.info.fetch({ eventId });
  if (!event) notFound();

  if (!user) {
    return (
      <MainShell>
        <h1>Sign in and join event to chat</h1>
        <SigninButtons />
      </MainShell>
    );
  }

  const hasJoinedEvent = await api.event.isJoined.fetch({ eventId });

  return <EventChat eventId={eventId} userId={user.id} initialIsJoined={hasJoinedEvent} />;
}
