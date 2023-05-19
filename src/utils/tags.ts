export function hasJoinedEventTag({ eventId, userId }: { eventId: number; userId: number }) {
  return `hasjoinedevent-${eventId}-${userId}`;
}

export function userTag({ userId }: { userId: number }) {
  return `user-${userId}`;
}
