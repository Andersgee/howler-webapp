import { z } from "zod";
import { getTile } from "#src/utils/tags";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tileRouter = createTRPCRouter({
  tileLocations: publicProcedure.input(z.object({ tileId: z.string() })).query(async ({ input }) => {
    return getTile({ tileId: input.tileId });
  }),
  multipleTileLocations: publicProcedure.input(z.object({ tileIds: z.array(z.string()) })).query(async ({ input }) => {
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
