import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { postRouter } from "./routers/post";
import { createTRPCRouter } from "./trpc";

export const trpcRouter = createTRPCRouter({
  post: postRouter,
});

export type TrpcRouter = typeof trpcRouter;

/** type utility, example: `type HelloInput = RouterInputs['example']['hello']` */
export type RouterInputs = inferRouterInputs<TrpcRouter>;

/** type utility, example: `type HelloOutput = RouterOutputs['example']['hello']` */
export type RouterOutputs = inferRouterOutputs<TrpcRouter>;
