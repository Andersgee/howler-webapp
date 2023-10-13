"use client";

import PlausibleProvider from "next-plausible";
import { FcmProvider } from "./Fcm";
import { TrpcProvider } from "./Trpc";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain="howler.andyfx.net">
      <TrpcProvider>
        <FcmProvider>{children}</FcmProvider>
      </TrpcProvider>
    </PlausibleProvider>
  );
}
