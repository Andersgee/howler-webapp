"use client";

import { DialogProvider } from "./DialogContext";
import { FcmProvider } from "./Fcm";
import { GoogleMapsProvider } from "./GoogleMaps";
import { TrpcProvider } from "./Trpc";
import { UserProvider } from "./UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <TrpcProvider>
        <FcmProvider>
          <DialogProvider>
            <GoogleMapsProvider>{children}</GoogleMapsProvider>
          </DialogProvider>
        </FcmProvider>
      </TrpcProvider>
    </UserProvider>
  );
}
