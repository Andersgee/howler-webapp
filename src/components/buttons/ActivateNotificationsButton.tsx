"use client";

import { useStore } from "#src/store";
import { IconBell } from "../Icons";
import { Button } from "../ui/Button";

export function ActivateNotificationsButton() {
  const fcm = useStore.use.fcm();
  const user = useStore.use.user();
  if (!user || !!fcm?.fcmToken) return null;

  return (
    <Button variant="default" onClick={() => fcm?.maybeRequestNotificationPermission()}>
      Turn on notifications <IconBell className="ml-2" />
    </Button>
  );
}
