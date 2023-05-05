import { envSchema } from "../utils/validate-process-env.mjs";
import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
