"use client";

import { useRouter } from "next/navigation";
import { api } from "#src/hooks/api";

export function CreateEventForm() {
  //const router = useRouter();
  const eventCreate = api.event.create.useMutation({
    //onSuccess: ({ eventHashId }) => {
    //  router.push(`/event/${eventHashId}`);
    //},
    onSuccess: (res) => {
      console.log(res);
    },
  });

  return (
    <div className="">
      <button
        //disabled={eventCreate.isLoading}
        className="bg-green-500 disabled:bg-red-500"
        onClick={() => {
          eventCreate.mutate({
            what: "hmm new debug what",
            when: new Date().getTime(),
            whenEnd: new Date().getTime(),
            where: "new debug where",
            who: "new debug who",
          });
        }}
      >
        CREATE EVENT
      </button>
    </div>
  );
}

/*
import { IconWhat, IconWhen, IconWhere, IconWho } from "#src/components/Icons";
import { InputWhen } from "../../components/InputWhen";
import { HowlButton } from "./HowlButton";

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
*/
