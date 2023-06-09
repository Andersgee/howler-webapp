"use client";

import { useTransition } from "react";

import { useNotificationsContext } from "#src/context/NotificationsContext";
import { IconBell } from "#src/icons/Bell";

type Props = {
  eventhashid: string;
  className?: string;
  action: (formData: FormData) => Promise<void | null>;
};

export function NotifyMeButton({ className = "", eventhashid, action }: Props) {
  const { getMyFcmToken } = useNotificationsContext();
  let [isPending, startTransition] = useTransition();

  return (
    <button
      className={className}
      onClick={async () => {
        const fcmToken = await getMyFcmToken();
        if (fcmToken) {
          const formData = new FormData();
          formData.set("fcmToken", fcmToken);
          formData.set("eventhashid", eventhashid);

          startTransition(async () => {
            const res = await action(formData);
            console.log("action res:", res);
          });
        } else {
          console.log("nah");
        }
      }}
    >
      <IconBell />
      <div>isPending: {JSON.stringify(isPending)}</div>
    </button>
  );
}
