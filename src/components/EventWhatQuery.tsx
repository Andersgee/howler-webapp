"use client";

import { api } from "#src/hooks/api";

type Props = {
  eventId: number;
  className?: string;
};

export function EventWhatFromId({ eventId, className }: Props) {
  const { data } = api.event.info.useQuery({ eventId }); //also cached server side

  return data ? `what: ${data.what}` : "what:";
}
