import { createTRPCReact } from "@trpc/react-query";

import type { TrpcRouter } from "#src/api";

export const api = createTRPCReact<TrpcRouter>();
