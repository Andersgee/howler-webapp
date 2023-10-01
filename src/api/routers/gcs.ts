import { z } from "zod";
import { db } from "#src/db";
import { getUploadCloudStoragSignedUrl } from "#src/utils/cloud-storage-url";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

//google cloud storage

export const gcsRouter = createTRPCRouter({
  signedUrl: protectedProcedure
    .input(z.object({ eventId: z.number(), contentType: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const fileName = `eventId${input.eventId}-userId${ctx.user.id}`;
      const signedUrl = await getUploadCloudStoragSignedUrl({ fileName, contentType: input.contentType });
      const imageUrl = `https://storage.googleapis.com/howler-event-images/${fileName}`;
      return { imageUrl, signedUrl };
    }),
  image: publicProcedure.input(z.object({ eventId: z.number() })).query(async ({ input, ctx }) => {
    const event = await db.selectFrom("Event").where("id", "=", input.eventId).select("image").executeTakeFirst();

    if (!event?.image) return null;
    return event.image;
  }),
});
