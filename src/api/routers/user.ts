import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { idFromHashid } from "#src/utils/hashid";
import { getIsFollowingUser, tagIsFollowingUser } from "#src/utils/tags";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  isFollowing: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ input, ctx }) => {
    return getIsFollowingUser({ myUserId: ctx.user.id, otherUserId: input.userId });
  }),
  image: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ input, ctx }) => {
    return db
      .selectFrom("User")
      .select(["User.id", "User.image", "User.name"])
      .where("User.id", "=", input.userId)
      .executeTakeFirst();
  }),
  follow: protectedProcedure.input(z.object({ userId: z.number() })).mutation(async ({ input, ctx }) => {
    const insertResult = await db
      .insertInto("UserUserPivot")
      .values({
        followerId: ctx.user.id,
        userId: input.userId,
      })
      .executeTakeFirst();

    const numInsertedRows = Number(insertResult.numInsertedOrUpdatedRows);
    if (!numInsertedRows) return false;

    revalidateTag(tagIsFollowingUser({ myUserId: ctx.user.id, otherUserId: input.userId }));
    return true;
  }),

  unFollow: protectedProcedure.input(z.object({ userId: z.number() })).mutation(async ({ input, ctx }) => {
    const deleteResult = await db
      .deleteFrom("UserUserPivot")
      .where("followerId", "=", ctx.user.id)
      .where("userId", "=", input.userId)
      .executeTakeFirst();

    const numDeletedRows = Number(deleteResult.numDeletedRows);
    if (!numDeletedRows) return false;
    revalidateTag(tagIsFollowingUser({ myUserId: ctx.user.id, otherUserId: input.userId }));
    return true;
  }),
});
