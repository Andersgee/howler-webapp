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
        <form className="flex  flex-col gap-3">
          <div className="flex items-center gap-1">
            <IconWhat />

            <span className="w-16 pr-2">What?</span>
            <div className="flex items-center bg-white dark:bg-black">
              <input name="what" type="text" placeholder="anything" className="bg-white px-2 py-1 dark:bg-black" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <IconWhere />
            <span className="w-16 pr-2">Where?</span>
            <div className="flex items-center bg-white dark:bg-black">
              <input name="where" type="text" placeholder="anywhere" className="bg-white px-2 py-1 dark:bg-black" />
            </div>
          </div>

          <div className="flex items-center gap-1 ">
            <IconWho />
            <span className="w-16 pr-2">Who?</span>
            <div className="flex items-center bg-white dark:bg-black">
              <select name="who" className="bg-white p-2 dark:bg-black">
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
            <span className="w-16 pr-2">When?</span>
            <InputWhen />
          </div>

          <div className="my-2 flex justify-center">
            <HowlButton />
          </div>
        </form>
      </div>
    </div>
  );
}
