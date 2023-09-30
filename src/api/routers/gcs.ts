import { z } from "zod";
import { getUploadCloudStoragSignedUrl } from "#src/utils/cloud-storage-url";
import { createTRPCRouter, protectedProcedure } from "../trpc";

//google cloud storage

export const gcsRouter = createTRPCRouter({
  signedUrls: protectedProcedure.input(z.object({ eventId: z.number() })).mutation(async ({ input, ctx }) => {
    const fileName = `eventId${input.eventId}-userId${ctx.user.id}`;
    const signedUrls = await getUploadCloudStoragSignedUrl({ fileName });
    const imageUrl = `https://storage.googleapis.com/howler-event-images/${fileName}`;
    return { imageUrl, signedUrls };
  }),
});
