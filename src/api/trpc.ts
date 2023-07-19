import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import { ZodError } from "zod";
//import { db } from "#src/db";
import { getUserFromRequestCookie } from "#src/utils/token";
import { transformer } from "./transformer";

export const createTRPCContext = async (_opts: FetchCreateContextFnOptions, nextRequest: NextRequest) => {
  const user = await getUserFromRequestCookie(nextRequest);

  return {
    user,
    //headers: opts.req.headers,
    //db: db,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
