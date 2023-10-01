import { z } from "zod";

//https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding#reverse-status-codes
export const signedUrlSchema = z.object({
  signedUrl: z.string(),
});

export type SignedUrlSchema = z.infer<typeof signedUrlSchema>;
