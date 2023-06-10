"use client";

import { useNotificationsContext } from "#src/context/NotificationsContext";

type Props = {
  className?: string;
};

export function MessagingTest({ className = "" }: Props) {
  const { messages, getFcmToken } = useNotificationsContext();
  return (
    <div className={className}>
      <h2>Notifications recieved while having app open (aka foreground) should appear here:</h2>
      <button
        onClick={async () => {
          const token = await getFcmToken();
        }}
      >
        TURN ON NOTIFICATIONS
      </button>
      <ul>
        {messages.map((message) => (
          <li key={message.messageId}>{JSON.stringify(message)}</li>
        ))}
      </ul>
    </div>
  );
}
