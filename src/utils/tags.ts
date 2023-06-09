/** order doesnt matter, meaning revalidating [myUserId,otherUserId] also revalidates [otherUserId,myUserId] */
export function tagIsFriend({ myUserId, friendUserId }: { myUserId: number; friendUserId: number }) {
  const [userId1, userId2] = [myUserId, friendUserId].sort((a, b) => a - b);
  return `isfriend-${userId1}-${userId2}`;
}

export function tagHasJoinedEvent({ eventId, userId }: { eventId: number; userId: number }) {
  return `hasjoinedevent-${eventId}-${userId}`;
}

export function tagEvents() {
  return "events";
}

export function tagUserInfo({ userId }: { userId: number }) {
  return `userinfo-${userId}`;
}
