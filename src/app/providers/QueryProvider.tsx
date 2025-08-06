// app/providers/ReactQueryProvider.tsx
"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // always stale
            gcTime: 0, // garbage collect immediately
            refetchOnWindowFocus: true,
            refetchOnMount: true,
          },
        },
      })
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
    });

    persistQueryClient({
      queryClient: client,
      persister: localStoragePersister,
      maxAge: 0, // 0 means no persistence across reloads
    });
  }, [client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
