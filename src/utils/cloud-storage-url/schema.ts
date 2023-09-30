import { z } from "zod";

//https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding#reverse-status-codes
export const signedUrlsSchema = z.object({
  signedUrlPng: z.string(),
  signedUrlJpeg: z.string(),
});

export type SignedUrlsSchema = z.infer<typeof signedUrlsSchema>;
