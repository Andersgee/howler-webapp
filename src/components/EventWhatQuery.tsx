"use client";

import { api } from "#src/hooks/api";

type Props = {
  eventId: number;
};

export function EventWhatFromId({ eventId }: Props) {
  const { data } = api.event.info.useQuery({ eventId }); //also cached server side

  //return data ? `what: ${data.what}` : "what:";
  return data ? data.what : "";
}
