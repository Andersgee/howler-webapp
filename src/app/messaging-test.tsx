"use client";

import { useNotificationsContext } from "#src/context/NotificationsContext";

type Props = {
  className?: string;
};

export function MessagingTest({ className = "" }: Props) {
  const { messages, getFcmToken } = useNotificationsContext();
  return (
    <div className={className}>
      <h2>Notificationtest</h2>
      <p>notifications recieved while having app open (aka foreground) should appear here</p>
      <button
        className="bg-blue-500 px-3 py-2 font-semibold text-white"
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
