"use client";

import { addHours, startOfHour, subHours } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconArrowDown, IconHowler, IconWhat, IconWhen, IconWhere, IconWho } from "#src/components/Icons";
import { api } from "#src/hooks/api";
import { datetimelocalString } from "#src/utils/date";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

const OPTIONS_WHO = {
  anyone: "anyone",
  friends: "Only my friends",
  friendsOfFriends: "My friends and their friends",
};

export function CreateEventForm() {
  const router = useRouter();
  const eventCreate = api.event.create.useMutation({
    onSuccess: ({ eventHashId }) => {
      router.push(`/event/${eventHashId}`);
    },
  });
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [who, setWho] = useState("");

  const [when, setWhen] = useState(startOfHour(addHours(new Date(), 1)));
  const [whenEnd, setWhenEnd] = useState(startOfHour(addHours(new Date(), 2)));

  return (
    <div className="flex flex-col items-center">
      {/* What */}
      <div className="flex items-center">
        <div className="flex w-24">
          <IconWhat />
          <span className="ml-2">What?</span>
        </div>
        <Input
          type="text"
          name="what"
          placeholder="anything"
          className="block"
          value={what}
          onChange={(e) => setWhat(e.target.value)}
        />
      </div>

      {/* Where */}
      <div className="flex items-center">
        <div className="flex w-24">
          <IconWhere />
          <span className="ml-2">Where?</span>
        </div>
        <Input
          type="text"
          name="where"
          placeholder="anywhere"
          className="block"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
        />
      </div>

      {/* Who */}
      <div className="flex grow-0 items-center">
        <div className="flex w-24">
          <IconWho />
          <span className="ml-2">Who?</span>
        </div>

        <Input
          type="text"
          name="who"
          placeholder="anyone"
          className="block"
          value={who}
          onChange={(e) => setWho(e.target.value)}
        />
      </div>

      {/* When */}
      <div className="flex">
        <div className="mt-1.5 flex w-24">
          <IconWhen />
          <span className="ml-2">When?</span>
        </div>
        <div className="">
          <Input
            type="datetime-local"
            name="when"
            className="block"
            value={datetimelocalString(when)}
            onChange={(e) => {
              if (!e.target.value) return;
              const newWhen = new Date(e.target.value);
              setWhen(newWhen);
              if (whenEnd.getTime() <= newWhen.getTime()) {
                setWhenEnd(addHours(newWhen, 1));
              }
            }}
          />

          <IconArrowDown height={18} width={18} className="mx-auto my-1" />
          <Input
            type="datetime-local"
            name="whenEnd"
            className="block"
            value={datetimelocalString(whenEnd)}
            onChange={(e) => {
              if (!e.target.value) return;
              const newWhenend = new Date(e.target.value);
              setWhenEnd(newWhenend);

              if (when.getTime() >= newWhenend.getTime()) {
                setWhen(subHours(newWhenend, 1));
              }
            }}
          />
        </div>
      </div>

      <div className="my-4 flex">
        <div className="w-24"></div>
        <div className="flex justify-center">
          <Button
            variant="default"
            disabled={eventCreate.isLoading}
            className="h-16 rounded-full px-6"
            onClick={() => {
              eventCreate.mutate({
                what: what,
                where: where,
                who: who,
                when: when,
                whenEnd: whenEnd,
              });
            }}
          >
            <span className="mr-2 text-2xl">Howl</span> <IconHowler className="h-12 w-12" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/*
import { IconWhat, IconWhen, IconWhere, IconWho } from "#src/components/Icons";
import { InputWhen } from "../../components/InputWhen";
import { HowlButton } from "./HowlButton";


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
