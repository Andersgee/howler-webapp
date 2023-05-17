"use client";

import { format, formatDistance } from "date-fns";
import { useEffect, useState } from "react";

function whenString(date: Date) {
  return `${format(date, "yyyy-MM-dd HH:mm")} (${formatDistance(date, Date.now(), {
    addSuffix: true,
  })})`;
}

export function WhenText({ date }: { date: Date }) {
  return <>{whenString(date)}</>;
}

async function getIsJoined(eventHashid: string) {
  try {
    const data = (await fetch(`/api/event/isjoined?event=${eventHashid}`).then((res) => res.json())) as {
      isjoined: boolean;
    };
    return data.isjoined;
  } catch (error) {
    return false;
  }
}

function useIsjoined(eventHashid: string) {
  const [isjoined, setIsjoined] = useState(false);
  useEffect(() => {
    getIsJoined(eventHashid).then((x) => {
      setIsjoined(x);
    });
  }, [eventHashid]);
  return isjoined;
}

export function JoinButton({ eventHashid }: { eventHashid: string }) {
  const isjoined = useIsjoined(eventHashid);

  return isjoined ? <div>you are already joined</div> : <div>click here to join</div>;
}
