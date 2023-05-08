import { z } from "zod";

export const TokenUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string(),
});

export type TokenUser = z.infer<typeof TokenUserSchema>;
