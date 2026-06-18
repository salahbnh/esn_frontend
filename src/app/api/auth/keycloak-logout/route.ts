import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

/**
 * Federated (single) logout. NextAuth's signOut only clears the app's own
 * session cookie — it does NOT end the Keycloak SSO session, so the next login
 * would silently re-authenticate the same user. This route builds Keycloak's
 * `end_session` URL (with the id_token hint) so the browser can fully log out
 * of Keycloak too. The client calls this BEFORE signOut (while the session is
 * still valid), then redirects here.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const origin = req.nextUrl.origin;

  const logoutUrl = new URL(
    `${env.keycloakIssuer}/protocol/openid-connect/logout`,
  );
  logoutUrl.searchParams.set("post_logout_redirect_uri", `${origin}/login`);
  // Keycloak 18+ honors post_logout_redirect_uri only with an id_token_hint or client_id.
  logoutUrl.searchParams.set("client_id", env.keycloakClientId);
  if (token?.idToken) {
    logoutUrl.searchParams.set("id_token_hint", token.idToken as string);
  }

  return NextResponse.json({ url: logoutUrl.toString() });
}
