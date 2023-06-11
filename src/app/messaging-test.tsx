"use client";

import { useNotificationsContext } from "#src/context/NotificationsContext";

type Props = {
  className?: string;
};

export function MessagingTest({ className = "" }: Props) {
  const { messages, getFcmToken, fcmToken } = useNotificationsContext();
  return (
    <div className={className}>
      <h2>Notification test</h2>
      <p>Foreground notifications (while having app open) should appear here.</p>
      <p>Background notifications (while its closed or whatever) should NOT appear here</p>
      {!fcmToken && (
        <button
          className="bg-blue-500 px-3 py-2 font-semibold text-white"
          onClick={async () => {
            const token = await getFcmToken();
          }}
        >
          TURN ON NOTIFICATIONS
        </button>
      )}
      <ul>
        {messages.map((message) => (
          <li key={message.messageId}>{JSON.stringify(message)}</li>
        ))}
      </ul>
    </div>
  );
}
