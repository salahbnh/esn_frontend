import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

import { env } from "@/lib/env";
import type { Role } from "@/lib/types";
import { ROLES } from "@/lib/types";

/**
 * NextAuth + Keycloak (OIDC, Authorization Code + PKCE, public client).
 *
 * The browser performs the login against Keycloak; the backend only ever
 * verifies the resulting access token against JWKS. We carry the access token
 * into the session so the API client can send `Authorization: Bearer <token>`,
 * and we refresh it via the refresh token before it expires so the user isn't
 * logged out mid-session.
 */

/** Refresh ~60s before the token actually expires. */
const EXPIRY_SKEW_MS = 60_000;

interface KeycloakAccessTokenClaims {
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
}

function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

/**
 * Decode (NOT verify — verification is the backend's job, against JWKS) the JWT
 * payload to extract the application role from `realm_access.roles`, falling
 * back to the client's `resource_access` roles.
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
      json.resource_access?.[env.keycloakClientId]?.roles ?? [];

    return [...realmRoles, ...clientRoles].find(isRole) ?? null;
  } catch {
    return null;
  }
}

/** Exchange the refresh token for a fresh access token at Keycloak's endpoint. */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) throw new Error("No refresh token");

    const res = await fetch(
      `${env.keycloakIssuer}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: env.keycloakClientId,
          refresh_token: token.refreshToken,
        }),
      },
    );

    const refreshed = (await res.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      error?: string;
    };

    if (!res.ok || !refreshed.access_token) {
      throw new Error(refreshed.error ?? "Refresh failed");
    }

    return {
      ...token,
      accessToken: refreshed.access_token,
      // Keycloak rotates refresh tokens; keep the new one if returned.
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + (refreshed.expires_in ?? 300),
      role: parseRoleFromAccessToken(refreshed.access_token),
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: env.keycloakClientId,
      issuer: env.keycloakIssuer,
      // Public client → no secret.
      clientSecret: "",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }): Promise<JWT> {
      // Initial sign-in: capture tokens + role.
      if (account?.access_token) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          expiresAt: account.expires_at,
          role: parseRoleFromAccessToken(account.access_token),
          error: undefined,
        };
      }

      // Still valid (with skew) → return as-is.
      const expiresAtMs = (token.expiresAt ?? 0) * 1000;
      if (Date.now() < expiresAtMs - EXPIRY_SKEW_MS) {
        return token;
      }

      // Near/after expiry → refresh.
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      if (session.user) {
        session.user.role = token.role ?? null;
      }
      return session;
    },
  },
};
