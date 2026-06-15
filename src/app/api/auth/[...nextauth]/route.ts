import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

/**
 * NextAuth route handler (App Router). Exposes the OIDC sign-in/out, callback
 * and session endpoints under /api/auth/*. The Keycloak access token + role are
 * carried into the session via the callbacks in `@/lib/auth`.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
