import { errorRouter } from "./routers/error";
import { eventRouter } from "./routers/event";
import { eventchatRouter } from "./routers/eventchat";
import { gcsRouter } from "./routers/gcs";
import { notificationRouter } from "./routers/notification";
import { tileRouter } from "./routers/tile";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const trpcRouter = createTRPCRouter({
  event: eventRouter,
  user: userRouter,
  notification: notificationRouter,
  eventchat: eventchatRouter,
  gcs: gcsRouter,
  tile: tileRouter,
  error: errorRouter,
});

export type TrpcRouter = typeof trpcRouter;
