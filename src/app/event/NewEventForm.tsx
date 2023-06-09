import { IconWhat } from "#src/icons/What";
import { IconWhen } from "#src/icons/When";
import { IconWhere } from "#src/icons/Where";
import { IconWho } from "#src/icons/Who";

import { HowlButton } from "./HowlButton";
import { InputWhen } from "./InputWhen";

const OPTIONS_WHO = {
  anyone: "anyone",
  friends: "Only my friends",
  friendsOfFriends: "My friends and their friends",
};

export function NewEventForm() {
  return (
    <div className="container flex justify-center">
      <div className="">
        <h1 className="text-center my-2">Make something happen!</h1>

        <form className="flex flex-col gap-3">
          <div className="flex items-center gap-1">
            <IconWhat />
            <span className="pr-2 w-16">What?</span>
            <div className="flex items-center bg-white dark:bg-black">
              <input name="what" type="text" placeholder="anything" className="bg-white px-2 py-1 dark:bg-black" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <IconWhere />
            <span className="pr-2 w-16">Where?</span>
            <div className="flex items-center bg-white dark:bg-black">
              <input name="where" type="text" placeholder="anywhere" className="bg-white px-2 py-1 dark:bg-black" />
            </div>
          </div>

          <div className="flex items-center gap-1 ">
            <IconWho />
            <span className="pr-2 w-16">Who?</span>
            <div className="flex items-center bg-white dark:bg-black">
              <select name="who" className="bg-white px-2 py-2 dark:bg-black ">
                {Object.entries(OPTIONS_WHO).map(([k, str]) => (
                  <option key={k} value={k}>
                    {str}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-start gap-1">
            <IconWhen />
            <span className="pr-2 w-16">When?</span>
            <InputWhen />
          </div>

          <div className="flex justify-center my-2">
            <HowlButton />
          </div>
        </form>
      </div>
    </div>
  );
}
