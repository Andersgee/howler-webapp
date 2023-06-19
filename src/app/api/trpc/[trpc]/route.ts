import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { trpcRouter } from "#src/api";
import { createTRPCContext } from "#src/api/trpc";

export const runtime = "edge";
export const dynamic = "force-dynamic";

//https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#preferredregion
//https://vercel.com/docs/concepts/edge-network/regions#region-list
export const preferredRegion = ["arn1"];

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: trpcRouter,
    createContext: (opts) => createTRPCContext(opts, req),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
          }
        : undefined,
  });

export { handler as GET, handler as POST };
