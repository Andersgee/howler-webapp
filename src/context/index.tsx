"use client";

import { DialogProvider } from "./DialogContext";
import { NotificationsProvider } from "./NotificationsContext";
import { TrpcProvider } from "./Trpc";
import { UserProvider } from "./UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <NotificationsProvider>
        <DialogProvider>
          <TrpcProvider>{children}</TrpcProvider>
        </DialogProvider>
      </NotificationsProvider>
    </UserProvider>
  );
}
