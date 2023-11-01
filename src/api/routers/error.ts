import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const errorRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string(), message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const insertResult = await db
        .insertInto("Error")
        .values({
          name: input.name,
          message: input.message,
          userId: ctx.user?.id,
        })
        .executeTakeFirst();

      return Number(insertResult.insertId);
    }),
});
