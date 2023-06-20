import { db } from "#src/db";

/** userId follows otherUserId */
export function tagIsFollowingUser({ myUserId, otherUserId }: { myUserId: number; otherUserId: number }) {
  return `isfollowing-${myUserId}-${otherUserId}`;
}

export function tagHasJoinedEvent({ eventId, userId }: { eventId: number; userId: number }) {
  return `hasjoinedevent-${eventId}-${userId}`;
}

export function tagIsSubscribedToEvent({ eventId, userId }: { eventId: number; userId: number }) {
  return `issusbscribedtoevent-${eventId}-${userId}`;
}

export function tagEvents() {
  return "events";
}

export function tagEventInfo({ eventId }: { eventId: number }) {
  return `event-${eventId}`;
}

export function tagUserInfo({ userId }: { userId: number }) {
  return `userinfo-${userId}`;
}
export async function getUserInfo({ userId }: { userId: number }) {
  return await db
    .selectFrom("User")
    .selectAll()
    .where("User.id", "=", userId)
    .getFirst({
      cache: "force-cache",
      next: {
        tags: [tagUserInfo({ userId })],
      },
    });
}
