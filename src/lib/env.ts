/**
 * Centralized, validated environment access. Read env here, not scattered
 * `process.env` lookups. Public (NEXT_PUBLIC_*) values are inlined at build
 * time and safe in the browser; the rest are server-only.
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    // In the browser, server-only vars are intentionally undefined — never throw there.
    if (typeof window === "undefined") {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return "";
  }
  return value;
}

export const env = {
  /** Backend REST API base, e.g. http://localhost:4000/api. Browser-safe. */
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api",
  /** Keycloak realm issuer, e.g. http://localhost:8080/realms/esn. Server-only. */
  keycloakIssuer: required("KEYCLOAK_ISSUER", process.env.KEYCLOAK_ISSUER),
  /** Public OIDC client id. Server-only. */
  keycloakClientId: process.env.KEYCLOAK_CLIENT_ID ?? "esn-frontend",
  /** NextAuth canonical URL. Server-only. */
  nextAuthUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
} as const;
