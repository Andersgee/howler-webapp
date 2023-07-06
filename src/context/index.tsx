"use client";

import { DialogProvider } from "./DialogContext";
import { FcmProvider } from "./Fcm";
import { TrpcProvider } from "./Trpc";
import { UserProvider } from "./UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <FcmProvider>
        <DialogProvider>
          <TrpcProvider>{children}</TrpcProvider>
        </DialogProvider>
      </FcmProvider>
    </UserProvider>
  );
}
