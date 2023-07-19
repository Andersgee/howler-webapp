import { eventRouter } from "./routers/event";
import { eventchatRouter } from "./routers/eventchat";
import { notificationRouter } from "./routers/notification";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const trpcRouter = createTRPCRouter({
  event: eventRouter,
  user: userRouter,
  notification: notificationRouter,
  eventchat: eventchatRouter,
});

export type TrpcRouter = typeof trpcRouter;
