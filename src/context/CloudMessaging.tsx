"use client";

import { useEffect } from "react";
import { useCloudMessagePayloadEffect } from "#src/hooks/useCloudMessagePayloadEffect";
import { initFcm } from "#src/store/actions";

export function CloudMessagingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initFcm();
  }, []);

  useCloudMessagePayloadEffect();
  return children;
}
