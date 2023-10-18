import { createServerSideHelpers } from "@trpc/react-query/server";
import { getUserFromCookie } from "#src/utils/token";
import { trpcRouter } from ".";
import { transformer } from "./transformer";

/*
const createServerTRPCContext = async () => {
  const user = await getUserFromCookie();
  return { user };
};
export const apiInternal = createServerSideHelpers({
  transformer: transformer,
  router: trpcRouter,
  ctx: await createServerTRPCContext(), //meh
});
*/

/**
 * trpc api for server components. calls the procedure directly without a fetch request
 * see https://trpc.io/docs/client/nextjs/server-side-helpers#1-internal-router
 *
 * ## Example
 *
 * ```ts
 * const { api, user } = await apiRsc();
 * const event = await api.event.info.fetch({ eventId });
 * ```
 *
 * obviously the called procedure itself might do requests, but the ending `.fetch()` just means call it.
 *
 * relies on `cookies()` from `"next/headers"` which makes route opt into dynamic rendering at request time.
 */
export const apiRsc = async () => {
  const user = await getUserFromCookie();

  return {
    api: createServerSideHelpers({
      transformer: transformer,
      router: trpcRouter,
      ctx: { user },
    }),
    user,
  };
};

/** trpc api for server components. calls the procedure directly without a fetch request
 *
 * only for public procedures
 */
export const apiRscPublic = createServerSideHelpers({
  transformer: transformer,
  router: trpcRouter,
  ctx: { user: null },
});
