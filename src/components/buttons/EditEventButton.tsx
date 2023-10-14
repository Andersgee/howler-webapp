"use client";

import { addHours, subHours } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#src/components/ui/Dialog";
import { api, type RouterOutputs } from "#src/hooks/api";
import { datetimelocalString } from "#src/utils/date";
import { IconArrowDown, IconEdit, IconWhat, IconWhen, IconWho } from "../Icons";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type Props = {
  eventId: number;
  initialEventInfo: NonNullable<RouterOutputs["event"]["info"]>;
};

export function EditEventButton({ eventId, initialEventInfo }: Props) {
  const [open, setOpen] = useState(false);

  const { data: event } = api.event.info.useQuery({ eventId }, { initialData: initialEventInfo });
  //const { data: event } = api.event.info.useQuery({ eventId });

  const apiContext = api.useContext();
  const eventUpdate = api.event.update.useMutation({
    onSuccess: (updatedEvent) => {
      if (updatedEvent) {
        apiContext.event.info.setData({ eventId }, () => updatedEvent);
      }
    },
    onSettled: () => setOpen(false),
  });
  const [what, setWhat] = useState(event?.what || "");
  const [who, setWho] = useState(event?.who || "");
  const [when, setWhen] = useState(event?.when || new Date());
  const [whenEnd, setWhenEnd] = useState(event?.whenEnd || new Date());

  return (
    <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <DialogTrigger asChild>
        <Button aria-label="edit" variant="secondary">
          <IconEdit /> <span className="ml-2">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit event</DialogTitle>
          <DialogDescription>Make changes to event here. Click save when done.</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <div>
            {/* What */}
            <div className="my-2 flex items-center">
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
                aria-label="what"
              />
            </div>
            {/* Who */}
            <div className="my-2 flex items-center">
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
                aria-label="who"
              />
            </div>
            {/* When */}
            <div className="my-2 flex">
              <div className="mt-1.5 flex w-24 grow-0">
                <IconWhen />
                <span className="ml-2">When?</span>
              </div>
              <div className="grow">
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
                  aria-label="when start"
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
                  aria-label="when end"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={eventUpdate.isLoading}
            onClick={() => {
              eventUpdate.mutate({
                eventId: eventId,
                what: what,
                who: who,
                when: when,
                whenEnd: whenEnd,
              });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
