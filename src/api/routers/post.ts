import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "#src/api/trpc";

export const postRouter = createTRPCRouter({
  currentUserLatest: protectedProcedure.query(async (opts) => {
    return opts.ctx.db.selectFrom("Example").selectAll().orderBy("id", "desc").limit(1).executeTakeFirst();
  }),

  getAll: publicProcedure.query(async (opts) => {
    const startTime = Date.now();
    const items = opts.ctx.db.selectFrom("Example").selectAll().orderBy("id", "desc").execute();
    const duration = Date.now() - startTime;
    return { items, duration, fetchedAt: new Date(startTime) };
  }),

  create: protectedProcedure.input(z.object({ text: z.string().min(1) })).mutation(async (opts) => {
    return opts.ctx.db.insertInto("Example").values({}).executeTakeFirst();
  }),
});
