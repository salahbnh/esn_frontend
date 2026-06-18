"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

import { apiClient } from "@/lib/api-client";

/**
 * Client-side API hook. Reads the access token from the NextAuth session and
 * returns verb helpers bound to it. Use in client components / TanStack Query
 * hooks: `const api = useApi(); api.get("/consultants");`
 */
export function useApi() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  return useMemo(() => apiClient(token), [token]);
}
