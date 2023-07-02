import { eventRouter } from "./routers/event";
import { eventchatRouter } from "./routers/eventchat";
import { notificationRouter } from "./routers/notification";
import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const trpcRouter = createTRPCRouter({
  post: postRouter,
  event: eventRouter,
  user: userRouter,
  notification: notificationRouter,
  eventchat: eventchatRouter,
});

export type TrpcRouter = typeof trpcRouter;
