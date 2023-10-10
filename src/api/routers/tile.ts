import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { getTile, tagEventInfo } from "#src/utils/tags";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tileRouter = createTRPCRouter({
  hello: protectedProcedure.input(z.object({ tileId: z.string() })).query(async ({ input, ctx }) => {
    return getTile({ tileId: input.tileId });
  }),
});
