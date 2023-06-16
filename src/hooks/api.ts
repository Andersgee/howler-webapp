import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "#src/api/root";

export const api = createTRPCReact<AppRouter>();
