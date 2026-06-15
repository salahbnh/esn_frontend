import type { DefaultSession } from "next-auth";

import type { Role } from "@/lib/types";

/**
 * Module augmentation so the Keycloak access token + application role are
 * type-safe on both the session and the JWT.
 */
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    role?: Role | null;
    user?: DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string | null;
    expiresAt?: number | null;
    role?: Role | null;
  }
}
