import type { DefaultSession } from "next-auth";

import type { Role } from "@/lib/types";

/**
 * Module augmentation: the Keycloak access token, refresh state, and the
 * application role are type-safe on both the session and the JWT.
 */
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: "RefreshError";
    user?: DefaultSession["user"] & {
      role?: Role | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string | null;
    /** Unix seconds. */
    expiresAt?: number | null;
    role?: Role | null;
    error?: "RefreshError";
  }
}
