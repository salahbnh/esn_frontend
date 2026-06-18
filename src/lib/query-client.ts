import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query client factory. One instance per app (created in Providers).
 * Defaults: 30s stale window (back-office data tolerates light caching),
 * a single retry, and no refetch-on-focus storm.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
