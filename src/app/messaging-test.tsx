"use client";

import { useNotificationsContext } from "src/context/NotificationsContext";

type Props = {
  className?: string;
};

export function MessagingTest({ className = "" }: Props) {
  const { messages, getMyFcmToken } = useNotificationsContext();
  return (
    <div className={className}>
      <h2>messaging-test</h2>
      <button onClick={() => getMyFcmToken()}>getMyFcmToken</button>
      <ul>
        {messages.map((message) => (
          <li key={message.messageId}>{JSON.stringify(message)}</li>
        ))}
      </ul>
    </div>
  );
}
