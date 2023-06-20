"use client";

import { useNotificationsContext } from "#src/context/NotificationsContext";
import { useUserContext } from "#src/context/UserContext";
import { Button } from "./ui/Button";

type Props = {
  className?: string;
};

export function ActivateNotificationsButton({ className = "" }: Props) {
  const { getFcmToken, fcmToken } = useNotificationsContext();
  const user = useUserContext();
  if (!user || fcmToken !== null) return null;

  return (
    <Button variant="default" className={className} onClick={async () => getFcmToken()}>
      TURN ON NOTIFICATIONS
    </Button>
  );
}
