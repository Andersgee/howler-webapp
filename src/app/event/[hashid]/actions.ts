"use server";

import { revalidateTag } from "next/cache";
import { db } from "src/db";
//import { validateFormData } from "src/utils/formdata";
import { idFromHashid } from "src/utils/hashid";
import { hasJoinedEventTag } from "src/utils/tags";
import { getUserFromCookie } from "src/utils/token";
import type { TokenUser } from "src/utils/token/schema";
import type { Prettify } from "src/utils/typescript";
import { z } from "zod";

function protectedAction<T extends z.ZodTypeAny>(
  schema: T,
  action: (data: Prettify<z.infer<T> & { user: TokenUser }>) => Promise<null | undefined>
) {
  return async (formData: FormData) => {
    const user = await getUserFromCookie();
    const parsedFormData = schema.safeParse(Object.fromEntries(formData));
    if (!parsedFormData.success || !user) {
      throw new Error("Invalid input.");
    }
    const data = parsedFormData.data;

    return action({ ...data, user });
  };
}

export const actionJoinOrLeaveEvent = protectedAction(
  z.object({
    eventhashid: z.string().min(1),
  }),
  async ({ eventhashid, user }) => {
    const eventId = idFromHashid(eventhashid);
    if (!eventId) {
      console.log("no eventId");
      return null;
    }

    const deleteResult = await db
      .deleteFrom("UserEventPivot")
      .where("userId", "=", user.id)
      .where("eventId", "=", eventId)
      .executeTakeFirst();

    const numDeletedRows = Number(deleteResult.numDeletedRows);
    if (!numDeletedRows) {
      await db
        .insertInto("UserEventPivot")
        .values({
          eventId: eventId,
          userId: user.id,
        })
        .executeTakeFirst();
    }

    revalidateTag(hasJoinedEventTag({ eventId, userId: user.id }));
  }
);

export async function actionJoinOrLeaveEventXXX(formData: FormData) {
  const user = await getUserFromCookie();
  if (!user) {
    console.log("no user");
    return null;
  }

  const parsedFormData = z
    .object({
      eventhashid: z.string().min(1),
    })
    .safeParse(Object.fromEntries(formData));

  if (!parsedFormData.success) {
    console.log(parsedFormData.error);
    return null;
  }

  const data = parsedFormData.data;

  const eventId = idFromHashid(data.eventhashid);
  if (!eventId) {
    console.log("no eventId");
    return null;
  }

  const deleteResult = await db
    .deleteFrom("UserEventPivot")
    .where("userId", "=", user.id)
    .where("eventId", "=", eventId)
    .executeTakeFirst();

  const numDeletedRows = Number(deleteResult.numDeletedRows);
  if (!numDeletedRows) {
    await db
      .insertInto("UserEventPivot")
      .values({
        eventId: eventId,
        userId: user.id,
      })
      .executeTakeFirst();
  }

  revalidateTag(hasJoinedEventTag({ eventId, userId: user.id }));
}
