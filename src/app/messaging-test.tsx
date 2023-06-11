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
      <p>
        Background notifications (while app is closed or not active?) should be proper notifications and not shown here.
      </p>
      <p>If notifications are not even turned on there will be a button here instead.</p>
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
      <div className="mb-4">
        <div>list of foreground messages:</div>
        <ul>
          {messages.map((message) => (
            <li className="my-2" key={message.messageId}>
              {JSON.stringify(message)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
