import { z } from "zod";
import { db } from "#src/db";
import { getUploadCloudStoragSignedUrl } from "#src/utils/cloud-storage-url";
import { hashidFromId } from "#src/utils/hashid";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

//google cloud storage

export const gcsRouter = createTRPCRouter({
  signedUrl: protectedProcedure
    .input(z.object({ eventId: z.number(), contentType: z.string() }))
    .mutation(async ({ input }) => {
      const hashId = hashidFromId(input.eventId);
      const uuid = crypto.randomUUID();
      const fileName = `${hashId}-${uuid}`;
      const data = await getUploadCloudStoragSignedUrl({ fileName, contentType: input.contentType });
      return data;
    }),
  image: publicProcedure.input(z.object({ eventId: z.number() })).query(async ({ input }) => {
    const event = await db.selectFrom("Event").where("id", "=", input.eventId).select("image").executeTakeFirst();

    if (!event?.image) return null;
    return event.image;
  }),
});
