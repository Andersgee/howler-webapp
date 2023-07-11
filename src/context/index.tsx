"use client";

import { DialogProvider } from "./DialogContext";
import { FcmProvider } from "./Fcm";
import { MapProvider } from "./Map";
import { TrpcProvider } from "./Trpc";
import { UserProvider } from "./UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <FcmProvider>
        <DialogProvider>
          <TrpcProvider>
            <MapProvider>{children}</MapProvider>
          </TrpcProvider>
        </DialogProvider>
      </FcmProvider>
    </UserProvider>
  );
}
