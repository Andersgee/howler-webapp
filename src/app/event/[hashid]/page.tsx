import { notFound } from "next/navigation";
import { getEvent } from "./data";
import { WhenText } from "./components";
import { IconWhat } from "src/icons/What";
import { IconWhere } from "src/icons/Where";
import { IconWhen } from "src/icons/When";
import { IconWho } from "src/icons/Who";
import { getUserFromCookie } from "src/utils/token";
import { JoinButton } from "./JoinButton";
import { IconArrowDown } from "src/icons/ArrowDown";

export default async function Page({ params }: { params: { hashid: string } }) {
  const event = await getEvent(params.hashid);
  if (!event) notFound();
  const user = await getUserFromCookie();

  return (
    <div className="container flex justify-center">
      <div className="">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1">
            <IconWhat />
            <span className="pr-2 w-16">What?</span>
            <div className="px-2 py-1 flex items-center bg-white dark:bg-black">{event.what || "anything"}</div>
          </div>
          <div className="flex items-center gap-1">
            <IconWhere />
            <span className="pr-2 w-16">Where?</span>
            <div className="px-2 py-1 bg-white dark:bg-black">{event.where || "anywhere"}</div>
          </div>
          <div className="flex items-center gap-1 ">
            <IconWho />
            <span className="pr-2 w-16">Who?</span>
            <div className="px-2 py-1 bg-white dark:bg-black">{event.who}</div>
          </div>
          <div className="flex items-start gap-1">
            <IconWhen />
            <span className="pr-2 w-16">When?</span>
            <div className="flex flex-col items-center bg-white dark:bg-black">
              <div className="px-2 py-1 bg-white dark:bg-black">
                <WhenText date={event.when} />
              </div>
              <IconArrowDown height={18} width={18} className="my-1" />
              <div className="px-2 py-1 bg-white dark:bg-black">
                <WhenText date={event.whenEnd} />
              </div>
            </div>
          </div>
          <div className="flex justify-center my-2">
            {/* @ts-expect-error Async Server Component */}
            <JoinButton eventHashid={params.hashid} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
