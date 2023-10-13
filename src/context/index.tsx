"use client";

import PlausibleProvider from "next-plausible";
import { FcmProvider } from "./Fcm";
import { TrpcProvider } from "./Trpc";
import { UserProvider } from "./UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain="howler.andyfx.net">
      <UserProvider>
        <TrpcProvider>
          <FcmProvider>{children}</FcmProvider>
        </TrpcProvider>
      </UserProvider>
    </PlausibleProvider>
  );
}
