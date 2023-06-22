import { revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { IconArrowDown, IconWhat, IconWhen, IconWhere, IconWho } from "#src/components/Icons";
import { JoinEventButton } from "#src/components/JoinEventButton";
import { ShareButton } from "#src/components/ShareButton";
import { LinkUserImage } from "#src/components/UserImage";
import { WhenText } from "#src/components/WhenText";
import { hashidFromId } from "#src/utils/hashid";
import { seo } from "#src/utils/seo";
import { getEventInfo, getHasJoinedEvent, tagHasJoinedEvent } from "#src/utils/tags";
import { getUserFromCookie } from "#src/utils/token";
import type { PageProps } from "#src/utils/typescript";
import { DynamicEventInfo } from "./DynamicEventInfo";

export async function generateMetadata({ params }: PageProps) {
  const event = await getEventInfo(params.hashid);
  if (!event) notFound();

  return seo({
    title: `${event.what} | Event | Howler`,
    description: `where: ${event.where} who: ${event.who} info: ${event.info}`,
    url: `/event/${params.hashid}`,
    image: "/icons/favicon-512x512.png",
  });
}

//export const runtime = "edge";
//export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps) {
  const event = await getEventInfo(params.hashid);
  if (!event) notFound();
  const user = await getUserFromCookie();
  const hasJoinedEvent = user ? await getHasJoinedEvent(params.hashid, user.id) : false;

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
              <IconWhat />
              <span className="w-16 pr-2">What?</span>
              <div className="flex items-center bg-white px-2 py-1 dark:bg-black">{event.what || "anything"}</div>
            </div>
            <div className="flex items-center gap-1">
              <IconWhere />
              <span className="w-16 pr-2">Where?</span>
              <div className="bg-white px-2 py-1 dark:bg-black">{event.where || "anywhere"}</div>
            </div>
            <div className="flex items-center gap-1 ">
              <IconWho />
              <span className="w-16 pr-2">Who?</span>
              <div className="bg-white px-2 py-1 dark:bg-black">{event.who}</div>
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
              <JoinEventButton eventHashId={params.hashid} isJoined={hasJoinedEvent} />
            </div>
            <div>
              <ShareButton title={event.what} />
            </div>
          </div>
        </div>
      </div>
      <DynamicEventInfo eventHashId={hashidFromId(event.id)} />
    </>
  );
}
