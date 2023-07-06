export async function notifyEventCreated({ eventId }: { eventId: number }) {
  const body = { eventId };
  return fetch(`${process.env.DATABASE_HTTP_URL}/notifyeventcreated`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
    },
    body: JSON.stringify(body),
  });
}

export async function postChatMessage(body: { eventId: number; userId: number; text: string }) {
  return fetch(`${process.env.DATABASE_HTTP_URL}/chat`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
    },
    body: JSON.stringify(body),
  });
}
