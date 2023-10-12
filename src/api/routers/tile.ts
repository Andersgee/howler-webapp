import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { getTile, tagEventInfo } from "#src/utils/tags";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tileRouter = createTRPCRouter({
  tileLocations: protectedProcedure.input(z.object({ tileId: z.string() })).query(async ({ input, ctx }) => {
    return getTile({ tileId: input.tileId });
  }),
  multipleTileLocations: protectedProcedure
    .input(z.object({ tileIds: z.array(z.string()) }))
    .query(async ({ input, ctx }) => {
      /*
      const eventLocations = await db
        .selectFrom("EventLocationTilePivot as p")
        .where("p.tileId", "in", input.tileIds)
        .innerJoin("EventLocation", "EventLocation.id", "p.eventLocationId")
        .selectAll("EventLocation")
        .execute();
      */
      const locationsList = await Promise.all(input.tileIds.map((tileId) => getTile({ tileId })));
      return locationsList.flat();
    }),
});
