"use client";

import PlausibleProvider from "next-plausible";
import { CloudMessaging } from "#src/components/CloudMessaging";
import { useSession } from "#src/hooks/useSession";
import { TrpcProvider } from "./Trpc";

export function Providers({ children }: { children: React.ReactNode }) {
  useSession();
  return (
    <PlausibleProvider domain="howler.andyfx.net">
      <TrpcProvider>
        {children}
        <CloudMessaging />
      </TrpcProvider>
    </PlausibleProvider>
  );
}
