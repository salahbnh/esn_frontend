import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

import type { Role } from "@/lib/types";
import { ROLES } from "@/lib/types";

/**
 * Auth foundation: NextAuth with the Keycloak OIDC provider.
 *
 * Why NextAuth (over keycloak-js): it gives us server-side session handling
 * (HTTP-only cookies, no token in JS-accessible storage), works cleanly with
 * the App Router + Route Handlers, and lets the typed API client read the
 * access token on the server. keycloak-js is browser-only and would push token
 * storage into client JS — heavier and less secure for an internal SSR app.
 *
 * The Keycloak access token (JWT) is carried through to the session so the
 * typed API client can send `Authorization: Bearer <accessToken>` to the
 * backend, which verifies it against Keycloak JWKS.
 */

const KEYCLOAK_ISSUER = process.env.KEYCLOAK_ISSUER ?? "";
const KEYCLOAK_CLIENT_ID =
  process.env.KEYCLOAK_CLIENT_ID ?? "esn-frontend";
const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET ?? "";

/** Shape of the Keycloak access-token claims we care about. */
interface KeycloakAccessTokenClaims {
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
}

function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

/**
 * Decode (without verifying — verification happens server-side on the backend
 * against JWKS) the JWT payload to extract the application role.
 * We prefer the realm role, falling back to the client's resource_access roles.
 */
function parseRoleFromAccessToken(accessToken: string): Role | null {
  try {
    const [, payload] = accessToken.split(".");
    if (!payload) return null;
    const json = JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8"),
    ) as KeycloakAccessTokenClaims;

    const realmRoles = json.realm_access?.roles ?? [];
    const clientRoles =
      json.resource_access?.[KEYCLOAK_CLIENT_ID]?.roles ?? [];

    const found = [...realmRoles, ...clientRoles].find(isRole);
    return found ?? null;
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      issuer: KEYCLOAK_ISSUER,
      clientId: KEYCLOAK_CLIENT_ID,
      // Public client → empty secret is fine. Set it if the client is confidential.
      clientSecret: KEYCLOAK_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    /**
     * Runs on sign-in (with `account`) and on every session read. On sign-in we
     * capture the Keycloak access token + expiry and derive the role from it.
     */
    async jwt({ token, account }): Promise<JWT> {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;
        token.role = parseRoleFromAccessToken(account.access_token);
      }
      return token;
    },
    /** Expose the access token + role to the client/server session object. */
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.role = token.role ?? null;
      return session;
    },
  },
};
