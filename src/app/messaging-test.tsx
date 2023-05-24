"use client";

import { getCurrentToken, requestNotificationPermission } from "src/utils/firebase/firebase";

type Props = {
  className?: string;
};

export function MessagingTest({ className = "" }: Props) {
  return (
    <div className={className}>
      <h2>messaging-test</h2>
      <button onClick={() => requestNotificationPermission()}>TURN ON NOTIFICATIONS</button>
      <button onClick={() => getCurrentToken()}>log current token</button>
    </div>
  );
}
