import { eventRouter } from "./routers/event";
import { notificationRouter } from "./routers/notification";
import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const trpcRouter = createTRPCRouter({
  post: postRouter,
  event: eventRouter,
  user: userRouter,
  notification: notificationRouter,
});

export type TrpcRouter = typeof trpcRouter;
