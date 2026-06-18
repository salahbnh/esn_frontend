import "server-only";

import { getServerSession } from "next-auth";

import { apiClient } from "@/lib/api-client";
import { authOptions } from "@/lib/auth";

/**
 * Server-side API helper. Reads the access token from the NextAuth session
 * (Server Components / Route Handlers / Server Actions) and returns verb
 * helpers bound to it.
 */
export async function serverApi() {
  const session = await getServerSession(authOptions);
  return apiClient(session?.accessToken);
}
