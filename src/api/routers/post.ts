import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  protectedGetLatestExample: protectedProcedure.query(async (opts) => {
    const examples = await opts.ctx.db
      .selectFrom("Example")
      .selectAll()
      .orderBy("id", "desc")
      .limit(1)
      .executeTakeFirst();
    return { examples, opts_ctx_user_name: opts.ctx.user.name };
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
