import { notFound } from "next/navigation";
import { JoinEventButton } from "#src/components/buttons/JoinEventButton";
import { ShareButton } from "#src/components/buttons/ShareButton";
import { EventChat } from "#src/components/EventChat";
import { IconArrowDown, IconWhat, IconWhen, IconWhere, IconWho } from "#src/components/Icons";
import { LinkUserImage } from "#src/components/UserImage";
import { WhenText } from "#src/components/WhenText";
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
  const hasJoinedEvent = user ? await getHasJoinedEvent({ eventHashid: params.hashid, userId: user.id }) : false;

  return (
    <>
      <div className="container flex justify-center">
        <div className="">
          <div className="flex items-center text-sm">
            <div>created by </div>
            <LinkUserImage src={event.creator.image!} alt={event.creator.name} userId={event.creator.id} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
              <IconWhat className="" />
              <span className="w-16 pr-2">What?</span>
              <div className="flex items-center bg-white px-2 py-1 dark:bg-black">{event.what || "anything"}</div>
            </div>
            <div className="flex items-center gap-1">
              <IconWhere />
              <span className="w-16 pr-2">Where?</span>
              <div className="bg-white px-2 py-1 dark:bg-black">{event.where || "anywhere"}</div>
            </div>
            <div className="flex items-center gap-1">
              <IconWho />
              <span className="w-16 pr-2">Who?</span>
              <div className="bg-white px-2 py-1 dark:bg-black">{event.who || "anyone"}</div>
            </div>
            <div className="flex items-start gap-1">
              <IconWhen />
              <span className="w-16 pr-2">When?</span>
              <div className="flex flex-col items-center bg-white dark:bg-black">
                <div className="bg-white px-2 py-1 dark:bg-black">
                  <WhenText date={event.when} />
                </div>
                <IconArrowDown height={18} width={18} className="my-1" />
                <div className="bg-white px-2 py-1 dark:bg-black">
                  <WhenText date={event.whenEnd} />
                </div>
              </div>
            </div>
            <div className="my-2 flex justify-center">
              <JoinEventButton eventHashId={params.hashid} initialIsJoined={hasJoinedEvent} />
            </div>
            <div>
              <ShareButton title={event.what} />
            </div>
          </div>

          {user && <EventChat eventId={eventId} userId={user.id} />}
        </div>
      </div>
    </>
  );
}
