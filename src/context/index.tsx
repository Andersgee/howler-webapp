"use client";

import PlausibleProvider from "next-plausible";
import { useSession } from "#src/hooks/useSession";
import { CloudMessagingProvider } from "./CloudMessaging";
import { TrpcProvider } from "./Trpc";

export function Providers({ children }: { children: React.ReactNode }) {
  useSession();

  return (
    <PlausibleProvider domain="howler.andyfx.net">
      <TrpcProvider>
        <CloudMessagingProvider>{children}</CloudMessagingProvider>
      </TrpcProvider>
    </PlausibleProvider>
  );
}
