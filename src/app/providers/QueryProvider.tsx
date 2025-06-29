// app/providers/ReactQueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useState, useEffect } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: 1000 * 60 * 60 * 24, //24 hours
          refetchOnWindowFocus: true,
          refetchOnMount: true,
          staleTime: 0,
        },
      },
    });
  });

  useEffect(() => {
    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
    });

    persistQueryClient({
      queryClient: client,
      persister: localStoragePersister,
      maxAge: 1000 * 60 * 60 * 24,
    });
  }, [client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
