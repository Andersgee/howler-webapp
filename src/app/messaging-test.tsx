"use client";

import { requestNotificationPermission } from "src/context/ServiceWorker/firebas-cloud-messaging";

type Props = {
  className?: string;
};

export function MessagingTest({ className = "" }: Props) {
  return (
    <div className={className}>
      <h2>messaging-test</h2>
      <button onClick={() => requestNotificationPermission()}>requestNotificationPermission</button>
    </div>
  );
}
