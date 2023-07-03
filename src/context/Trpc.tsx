"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { transformer } from "#src/api/transformer";
import { api } from "#src/hooks/api";
import { baseUrl } from "#src/utils/url";

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            refetchInterval: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            refetchIntervalInBackground: false,
            retry: false,
            cacheTime: 1000 * 60 * 60, //(default is 5 min) would refetch any query "not on screen" for 5 min, increase this..
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: transformer,
      links: [
        httpBatchLink({
          url: baseUrl("/api/trpc"),
        }),
      ],
    })
  );
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
