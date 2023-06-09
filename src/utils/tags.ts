/** userId follows otherUserId */
export function tagIsFollowingUser({ myUserId, otherUserId }: { myUserId: number; otherUserId: number }) {
  return `isfollowing-${myUserId}-${otherUserId}`;
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
