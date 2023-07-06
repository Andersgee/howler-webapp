"use client";

import { useFcmContext } from "#src/context/Fcm";
import { useUserContext } from "#src/context/UserContext";
import { IconBell } from "../Icons";
import { Button } from "../ui/Button";

export function ActivateNotificationsButton() {
  const { getFcmToken, fcmToken } = useFcmContext();
  const user = useUserContext();
  if (!user || fcmToken !== null) return null;

  return (
    <Button variant="default" onClick={async () => getFcmToken()}>
      Turn on notifications <IconBell className="ml-2" />
    </Button>
  );
}
