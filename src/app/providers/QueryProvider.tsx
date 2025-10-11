// app/providers/ReactQueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  // ensure only one client instance per component tree
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
            gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
            refetchOnWindowFocus: true, // Good for social apps to show latest data
            refetchOnReconnect: true, // Refetch when connection is restored
            refetchOnMount: true, // Refetch stale data on mount (not always)
            retry: 1, // Retry failed requests once
          },
          mutations: {
            retry: 1, // Retry failed mutations once
            retryDelay: 1000, // Wait 1 second before retrying
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
