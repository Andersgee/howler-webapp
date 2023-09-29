import { z } from "zod";

//https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding#reverse-status-codes
export const cloudStorageUrlSchema = z.object({
  googleCloudStorageSignedUrl: z.string(),
});

export type CloudStorageUrlSchema = z.infer<typeof cloudStorageUrlSchema>;
