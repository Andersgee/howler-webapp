import { z } from "zod";
import { db } from "#src/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const tagsTileRouter = {
  locations: (p: { tileId: string }) => `tile-locations-${p.tileId}`,
};

export const tileRouter = createTRPCRouter({
  locations: publicProcedure.input(z.object({ tileId: z.string() })).query(async ({ input }) => {
    return await db
      .selectFrom("EventLocationTilePivot")
      .where("EventLocationTilePivot.tileId", "=", input.tileId)
      .innerJoin("EventLocation", "EventLocation.id", "EventLocationTilePivot.eventLocationId")
      .innerJoin("Event", "EventLocation.eventId", "Event.id")
      .select([
        "Event.id",
        "Event.what",
        "Event.when",
        "EventLocation.placeName",
        "EventLocation.lng",
        "EventLocation.lat",
      ])
      .get({
        next: { tags: [tagsTileRouter.locations({ tileId: input.tileId })] },
      });
  }),
  multipleTileLocations: publicProcedure.input(z.object({ tileIds: z.array(z.string()) })).query(async ({ input }) => {
    const locationsList = await Promise.all(
      input.tileIds.map((tileId) =>
        db
          .selectFrom("EventLocationTilePivot")
          .where("EventLocationTilePivot.tileId", "=", tileId)
          .innerJoin("EventLocation", "EventLocation.id", "EventLocationTilePivot.eventLocationId")
          .innerJoin("Event", "EventLocation.eventId", "Event.id")
          .select([
            "Event.id",
            "Event.what",
            "Event.when",
            "EventLocation.placeName",
            "EventLocation.lng",
            "EventLocation.lat",
          ])
          .get({
            next: { tags: [tagsTileRouter.locations({ tileId })] },
          })
      )
    );

    return locationsList.flat();
  }),
});
