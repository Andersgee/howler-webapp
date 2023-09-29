"use client";

import PlausibleProvider from "next-plausible";
import { DialogProvider } from "./DialogContext";
import { FcmProvider } from "./Fcm";
import { GoogleMapsProvider } from "./GoogleMaps";
import { TrpcProvider } from "./Trpc";
import { UserProvider } from "./UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain="howler.andyfx.net">
      <UserProvider>
        <TrpcProvider>
          <FcmProvider>
            <DialogProvider>
              <GoogleMapsProvider>{children}</GoogleMapsProvider>
            </DialogProvider>
          </FcmProvider>
        </TrpcProvider>
      </UserProvider>
    </PlausibleProvider>
  );
}
