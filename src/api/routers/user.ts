import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tagsUserRouter = {
  info: (p: { userId: number }) => `user-info-${p.userId}`,
  isFollowing: (p: { myId: number; otherId: number }) => `user-isFollowing-${p.myId}-${p.otherId}`,
};

export const userRouter = createTRPCRouter({
  info: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
    return db
      .selectFrom("User")
      .selectAll()
      .where("User.id", "=", input.userId)
      .getFirst({
        next: { tags: [tagsUserRouter.info(input)] },
      });
  }),
  infoPublic: publicProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
    return db
      .selectFrom("User")
      .select(["id", "name", "image"])
      .where("User.id", "=", input.userId)
      .getFirst({
        next: { tags: [tagsUserRouter.info(input)] },
      });
  }),
  isFollowing: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ input, ctx }) => {
    const r = await db
      .selectFrom("UserUserPivot")
      .select(["userId", "followerId"])
      .where("followerId", "=", ctx.user.id)
      .where("userId", "=", input.userId)
      .getFirst({
        next: { tags: [tagsUserRouter.isFollowing({ myId: ctx.user.id, otherId: input.userId })] },
      });

    if (r) return true;
    return false;
  }),
  follow: protectedProcedure.input(z.object({ userId: z.number() })).mutation(async ({ input, ctx }) => {
    const _insertResult = await db
      .insertInto("UserUserPivot")
      .ignore()
      .values({
        followerId: ctx.user.id,
        userId: input.userId,
      })
      .executeTakeFirst();

    revalidateTag(tagsUserRouter.isFollowing({ myId: ctx.user.id, otherId: input.userId }));
    return true;
  }),

  unFollow: protectedProcedure.input(z.object({ userId: z.number() })).mutation(async ({ input, ctx }) => {
    const _deleteResult = await db
      .deleteFrom("UserUserPivot")
      .where("followerId", "=", ctx.user.id)
      .where("userId", "=", input.userId)
      .executeTakeFirst();

    revalidateTag(tagsUserRouter.isFollowing({ myId: ctx.user.id, otherId: input.userId }));
    return true;
  }),
});
