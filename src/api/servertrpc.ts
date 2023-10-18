import { createServerSideHelpers } from "@trpc/react-query/server";
import { getUserFromCookie } from "#src/utils/token";
import { trpcRouter } from ".";
import { transformer } from "./transformer";

const createServerTRPCContext = async () => {
  const user = await getUserFromCookie();

  return {
    user,
    //headers: opts.req.headers,
    //db: db,
  };
};

// trpc api for use in server components.
// calls the procedure directly (without a fetch request)
// https://trpc.io/docs/client/nextjs/server-side-helpers#1-internal-router
// so grab user from `cookies()` via `"next/headers"` instead of from `request.cookies`

/*
export const apiInternal = createServerSideHelpers({
  transformer: transformer,
  router: trpcRouter,
  ctx: await createServerTRPCContext(), //meh
});
*/

type CtxUser = Awaited<ReturnType<typeof getUserFromCookie>>;
export const apiRsc = (user: CtxUser) =>
  createServerSideHelpers({
    transformer: transformer,
    router: trpcRouter,
    ctx: { user },
  });

export const apiRscPublic = createServerSideHelpers({
  transformer: transformer,
  router: trpcRouter,
  ctx: { user: null },
});
