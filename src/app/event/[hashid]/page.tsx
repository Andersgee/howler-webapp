import { notFound } from "next/navigation";
import { idFromHashid } from "src/utils/hashid";
import { getEvent } from "./data";
import { WhenText } from "./components";
import { IconWhat } from "src/icons/What";
import { IconWhere } from "src/icons/Where";
import { IconWhen } from "src/icons/When";
import { IconWho } from "src/icons/Who";
import { IconHowler } from "src/icons/Howler";

export default async function Page({ params }: { params: { hashid: string } }) {
  const event = await getEvent(params.hashid);
  if (!event) notFound();

  return (
    <main className="container">
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

          <div className="px-2 py-1 bg-white dark:bg-black">
            <WhenText date={event.when} />
          </div>
          <div className="px-2 py-1 bg-white dark:bg-black">
            <WhenText date={event.whenEnd} />
          </div>
        </div>

        <div className="my-6 ml-6 flex w-60 flex-col items-center">
          <p className="mb-1 text-center  text-sm">letsgo</p>
          <button
            type="submit"
            className="flex w-40 items-center justify-center rounded-full border-2 border-black bg-blue-50 px-2 py-2 transition-colors hover:bg-blue-200"
          >
            <span className="mr-2 text-2xl text-black">yep!</span>
            <IconHowler />
          </button>
        </div>
      </div>
    </main>
  );
}
