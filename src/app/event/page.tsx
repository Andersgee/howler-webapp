import { IconWhat } from "src/icons/What";
import { myAction } from "./actions";
import { IconWhere } from "src/icons/Where";
import { IconWhen } from "src/icons/When";
import { IconWho } from "src/icons/Who";
import { IconHowler } from "src/icons/Howler";
import { datetimelocalString } from "src/utils/date";
import { InputWhen } from "./InputWhen";
//import { roundToNearestMinutes,endOfHour } from "date-fns";

const OPTIONS_WHO = {
  anyone: "Who? (anyone)",
  friends: "Only my friends",
  friendsOfFriends: "My friends and their friends",
};

export default function Page() {
  //const defaultWhen = roundToNearestMinutes(new Date(), { nearestTo: 30, roundingMethod: "ceil" });
  //const defaultWhen = endOfHour()
  const defaultWhen = new Date();
  return (
    <div>
      <h1>create event</h1>
      <p>Lorem ipsum dolor sit amet consectetur.</p>
      <form action={myAction}>
        <div className="flex items-center gap-1">
          <IconWhat />
          <input
            name="what"
            type="text"
            placeholder="What? (anything)"
            className="w-64 bg-white px-2 py-1 dark:bg-black"
          />
        </div>

        <div className="flex items-center gap-1">
          <IconWhere />
          <input
            name="where"
            type="text"
            placeholder="Where? (anywhere)"
            className="w-64 bg-white px-2 py-1 dark:bg-black"
          />
        </div>

        <div className="flex items-center gap-1">
          <IconWhen />
          <InputWhen />
        </div>

        <div className="flex items-center gap-1">
          <IconWho />
          <select name="who" className="w-64 bg-white px-2 py-2 text-neutral-400 dark:bg-black">
            {Object.entries(OPTIONS_WHO).map(([k, str]) => (
              <option key={k} value={k}>
                {str}
              </option>
            ))}
          </select>
        </div>

        <div className="my-6 ml-6 flex w-60 flex-col items-center">
          <p className="mb-1 text-center text-sm">make something happen</p>
          <button
            type="submit"
            className="flex w-40 items-center justify-center rounded-full border-2 border-black bg-blue-50 px-2 py-2 transition-colors hover:bg-blue-200"
          >
            <span className="mr-2 text-2xl text-black">Howl</span>
            <IconHowler />
          </button>
        </div>
      </form>
    </div>
  );
}
