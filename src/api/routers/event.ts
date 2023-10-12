import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "#src/db";
import { getGoogleReverseGeocoding } from "#src/utils/geocoding";
import { hashidFromId } from "#src/utils/hashid";
import { notifyEventCreated } from "#src/utils/notify";
import {
  getEventInfo,
  getEventLocation,
  getHasJoinedEvent,
  tagEventInfo,
  tagEventLocation,
  tagEvents,
  tagHasJoinedEvent,
} from "#src/utils/tags";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  isJoined: protectedProcedure.input(z.object({ eventId: z.number() })).query(async ({ input, ctx }) => {
    return getHasJoinedEvent({ eventId: input.eventId, userId: ctx.user.id });
  }),
  info: publicProcedure.input(z.object({ eventId: z.number() })).query(async ({ input, ctx }) => {
    return getEventInfo({ eventId: input.eventId });
  }),
  location: publicProcedure.input(z.object({ eventId: z.number() })).query(async ({ input, ctx }) => {
    return getEventLocation({ eventId: input.eventId });
  }),
  join: protectedProcedure.input(z.object({ eventId: z.number() })).mutation(async ({ input, ctx }) => {
    const _insertResult = await db
      .insertInto("UserEventPivot")
      .values({
        eventId: input.eventId,
        userId: ctx.user.id,
      })
      .executeTakeFirstOrThrow();

    revalidateTag(tagHasJoinedEvent({ eventId: input.eventId, userId: ctx.user.id }));

    return { eventId: input.eventId, userId: ctx.user.id };
  }),
  leave: protectedProcedure.input(z.object({ eventId: z.number() })).mutation(async ({ input, ctx }) => {
    const _deleteResult = await db
      .deleteFrom("UserEventPivot")
      .where("userId", "=", ctx.user.id)
      .where("eventId", "=", input.eventId)
      .executeTakeFirstOrThrow();

    revalidateTag(tagHasJoinedEvent({ eventId: input.eventId, userId: ctx.user.id }));
    return { eventId: input.eventId, userId: ctx.user.id };
  }),
  delete: protectedProcedure.input(z.object({ eventId: z.number() })).mutation(async ({ input, ctx }) => {
    const deleteResult = await db
      .deleteFrom("Event")
      .where("id", "=", input.eventId)
      .where("creatorId", "=", ctx.user.id)
      .executeTakeFirstOrThrow();

    const numDeletedRows = Number(deleteResult.numDeletedRows);
    if (!numDeletedRows) return false;

    revalidateTag(tagEventInfo({ eventId: input.eventId }));

    return true;
  }),
  create: protectedProcedure
    .input(
      z.object({
        what: z.string(),
        where: z.string(),
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
          where: input.where,
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
      //revalidateTag(tagEvents());

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
    .mutation(async ({ input, ctx }) => {
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

      const eventInfo = await getEventInfo({ eventId: input.eventId }, false);

      revalidateTag(tagEventInfo({ eventId: input.eventId }));

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
    .mutation(async ({ input, ctx }) => {
      //await artificialDelay()

      const placeName = await getGoogleReverseGeocoding({ lng: input.lng, lat: input.lat });

      const updateResult = await db
        .updateTable("EventLocation")
        .where("eventId", "=", input.eventId)
        .set({
          lng: input.lng,
          lat: input.lat,
          placeName: placeName,
        })
        .executeTakeFirstOrThrow();

      const numUpdatedRows = Number(updateResult.numUpdatedRows);
      if (!numUpdatedRows) {
        const _insertResult = await db
          .insertInto("EventLocation")
          .values({
            eventId: input.eventId,
            lng: input.lng,
            lat: input.lat,
            placeName: placeName,
          })
          .executeTakeFirstOrThrow();
      }

      const eventLocation = await getEventLocation({ eventId: input.eventId }, false);

      revalidateTag(tagEventLocation({ eventId: input.eventId }));
      //revalidateTag(tagEventInfo({ eventId: input.eventId }));

      return eventLocation;
    }),

  updateImage: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        image: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const _updateResult = await db
        .updateTable("Event")
        .where("id", "=", input.eventId)
        .set({
          image: input.image,
        })
        .executeTakeFirstOrThrow();

      //const numUpdatedRows = Number(updateResult.numUpdatedRows);
      //if (!numUpdatedRows) return false;

      //does this even work?..
      revalidateTag(tagEventInfo({ eventId: input.eventId }));
      return true;
    }),
});
