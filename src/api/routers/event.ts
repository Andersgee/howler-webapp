import { jsonObjectFrom } from "kysely/helpers/mysql";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { tileIdsFromLngLat, uniqueStrings } from "#src/components/GoogleMap/utils";
import { db } from "#src/db";
import { removeImageFromEventAndCloudStorage } from "#src/utils/cloud-storage-url";
import { getGoogleReverseGeocoding } from "#src/utils/geocoding";
import { hashidFromId } from "#src/utils/hashid";
import { notifyEventCreated } from "#src/utils/notify";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { tagsTileRouter } from "./tile";

export const tagsEventRouter = {
  info: (p: { eventId: number }) => `event-info-${p.eventId}`,
  isJoined: (p: { eventId: number; userId: number }) => `event-isJoined-${p.eventId}-${p.userId}`,
  location: (p: { eventId: number }) => `event-location-${p.eventId}`,
};

export const eventRouter = createTRPCRouter({
  isJoined: protectedProcedure.input(z.object({ eventId: z.number() })).query(async ({ input, ctx }) => {
    const userEventPivot = await db
      .selectFrom("UserEventPivot")
      .select("userId")
      .where("userId", "=", ctx.user.id)
      .where("eventId", "=", input.eventId)
      .getFirst({
        next: {
          tags: [tagsEventRouter.isJoined({ eventId: input.eventId, userId: ctx.user.id })],
        },
      });

    if (userEventPivot) return true;
    return false;
  }),
  info: publicProcedure.input(z.object({ eventId: z.number() })).query(async ({ input }) => {
    return await db
      .selectFrom("Event")
      .selectAll("Event")
      .where("Event.id", "=", input.eventId)
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom("User")
            .select(["User.id", "User.name", "User.image"])
            .whereRef("User.id", "=", "Event.creatorId")
        ).as("creator"),
      ])
      .getFirst({ next: { tags: [tagsEventRouter.info(input)] } });
  }),
  location: publicProcedure.input(z.object({ eventId: z.number() })).query(async ({ input }) => {
    return await db
      .selectFrom("EventLocation")
      .selectAll("EventLocation")
      .where("EventLocation.eventId", "=", input.eventId)
      .getFirst({
        next: { tags: [tagsEventRouter.location(input)] },
      });
  }),
  join: protectedProcedure.input(z.object({ eventId: z.number() })).mutation(async ({ input, ctx }) => {
    const _insertResult = await db
      .insertInto("UserEventPivot")
      .ignore()
      .values({
        eventId: input.eventId,
        userId: ctx.user.id,
      })
      .executeTakeFirstOrThrow();

    revalidateTag(tagsEventRouter.isJoined({ eventId: input.eventId, userId: ctx.user.id }));

    return { eventId: input.eventId, userId: ctx.user.id };
  }),
  leave: protectedProcedure.input(z.object({ eventId: z.number() })).mutation(async ({ input, ctx }) => {
    const _deleteResult = await db
      .deleteFrom("UserEventPivot")
      .where("userId", "=", ctx.user.id)
      .where("eventId", "=", input.eventId)
      .executeTakeFirstOrThrow();

    revalidateTag(tagsEventRouter.isJoined({ eventId: input.eventId, userId: ctx.user.id }));
    return { eventId: input.eventId, userId: ctx.user.id };
  }),
  delete: protectedProcedure.input(z.object({ eventId: z.number() })).mutation(async ({ input, ctx }) => {
    const existingEventLocation = await db
      .selectFrom("EventLocation")
      .select(["lng", "lat"])
      .where("eventId", "=", input.eventId)
      .executeTakeFirst();

    const deleteResult = await db
      .deleteFrom("Event")
      .where("id", "=", input.eventId)
      .where("creatorId", "=", ctx.user.id)
      .executeTakeFirstOrThrow();

    const numDeletedRows = Number(deleteResult.numDeletedRows);
    if (!numDeletedRows) return false;

    revalidateTag(tagsEventRouter.info(input));
    if (existingEventLocation) {
      const tileIds = tileIdsFromLngLat(existingEventLocation);
      for (const tileId of tileIds) {
        revalidateTag(tagsTileRouter.locations({ tileId }));
      }
    }

    return true;
  }),
  create: protectedProcedure
    .input(
      z.object({
        what: z.string(),
        //where: z.string(),
        when: z.date(),
        whenEnd: z.date(),
        who: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      //await artificialDelay()

      const insertresult = await db
        .insertInto("Event")
        .values({
          creatorId: ctx.user.id,
          what: input.what,
          where: "",
          when: input.when,
          whenEnd: input.whenEnd,
          who: input.who,
          info: "no info",
        })
        .executeTakeFirstOrThrow();
      const insertId = Number(insertresult.insertId);

      //auto join creator to event
      await db
        .insertInto("UserEventPivot")
        .values({
          eventId: insertId,
          userId: ctx.user.id,
        })
        .execute();

      const hashid = hashidFromId(insertId);

      await notifyEventCreated({ eventId: insertId });

      return { eventId: insertId, eventHashId: hashid };
    }),

  update: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        what: z.string(),
        when: z.date(),
        whenEnd: z.date(),
        who: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      //await artificialDelay()

      const _updateResult = await db
        .updateTable("Event")
        .where("id", "=", input.eventId)
        .set({
          what: input.what,
          when: input.when,
          whenEnd: input.whenEnd,
          who: input.who,
        })
        .executeTakeFirstOrThrow();

      const eventInfo = await db
        .selectFrom("Event")
        .selectAll("Event")
        .where("Event.id", "=", input.eventId)
        .select((eb) => [
          jsonObjectFrom(
            eb
              .selectFrom("User")
              .select(["User.id", "User.name", "User.image"])
              .whereRef("User.id", "=", "Event.creatorId")
          ).as("creator"),
        ])
        .getFirst({
          cache: "no-store",
          next: { tags: [tagsEventRouter.info(input)] },
        });

      //also need to update tiles cuz changed name
      const eventLocation = await db
        .selectFrom("EventLocation")
        .select(["lng", "lat"])
        .where("eventId", "=", input.eventId)
        .getFirst({ cache: "no-store" });
      const tileIds = eventLocation ? tileIdsFromLngLat(eventLocation) : [];

      revalidateTag(tagsEventRouter.info(input));
      for (const tileId of tileIds) {
        revalidateTag(tagsTileRouter.locations({ tileId }));
      }

      return eventInfo;
    }),

  updateLocation: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        lng: z.number(),
        lat: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      //await artificialDelay()

      const placeName = await getGoogleReverseGeocoding({ lng: input.lng, lat: input.lat });

      const existingEventLocation = await db
        .selectFrom("EventLocation")
        .select(["id", "lng", "lat"])
        .where("eventId", "=", input.eventId)
        .getFirst({ cache: "no-store" });

      const oldTileIds = existingEventLocation
        ? tileIdsFromLngLat({ lng: existingEventLocation.lng, lat: existingEventLocation.lat })
        : [];
      const newTileIds = tileIdsFromLngLat({ lng: input.lng, lat: input.lat });

      //make sure new tiles exist
      const _insertResult_Tiles = await db
        .insertInto("Tile")
        .ignore() //ignore the insert if already exists
        .values(newTileIds.map((tileId) => ({ id: tileId })))
        .executeTakeFirstOrThrow();

      //update or insert location
      let eventLocationId: number;
      if (existingEventLocation) {
        const _updateResult_EventLocation = await db
          .updateTable("EventLocation")
          .where("eventId", "=", input.eventId)
          .set({
            lng: input.lng,
            lat: input.lat,
            placeName: placeName,
          })
          .executeTakeFirstOrThrow();

        eventLocationId = existingEventLocation.id;
      } else {
        const insertResult_EventLocation = await db
          .insertInto("EventLocation")
          .values({
            eventId: input.eventId,
            lng: input.lng,
            lat: input.lat,
            placeName: placeName,
          })
          .executeTakeFirstOrThrow();

        eventLocationId = Number(insertResult_EventLocation.insertId);
      }

      //also update EventLocationTilePivot's for this specific EventLocation
      const _deleteResult_EventLocationTilePivot = await db
        .deleteFrom("EventLocationTilePivot")
        .where("eventLocationId", "=", eventLocationId)
        .executeTakeFirst();
      const _insertResult_EventLocationTilePivot = await db
        .insertInto("EventLocationTilePivot")
        .ignore() //ignore the insert if already exists
        .values(
          newTileIds.map((tileId) => ({
            eventLocationId: eventLocationId,
            tileId: tileId,
          }))
        )
        .executeTakeFirst();

      //const eventLocation = await getEventLocation({ eventId: input.eventId }, false);

      const eventLocation = await db
        .selectFrom("EventLocation")
        .selectAll("EventLocation")
        .where("EventLocation.eventId", "=", input.eventId)
        .getFirst({
          cache: "no-store",
        });

      revalidateTag(tagsEventRouter.info(input));
      revalidateTag(tagsEventRouter.location(input));
      for (const tileId of uniqueStrings(oldTileIds.concat(newTileIds))) {
        revalidateTag(tagsTileRouter.locations({ tileId }));
      }

      return eventLocation;
    }),

  updateImage: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        image: z.string(),
        imageAspectRatio: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await removeImageFromEventAndCloudStorage({ eventId: input.eventId });
      const _updateResult = await db
        .updateTable("Event")
        .where("id", "=", input.eventId)
        .set({
          image: input.image,
          imageAspectRatio: input.imageAspectRatio,
        })
        .executeTakeFirstOrThrow();

      revalidateTag(tagsEventRouter.info(input));
      return true;
    }),
});
