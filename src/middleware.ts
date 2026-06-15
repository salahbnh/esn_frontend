export { default } from "next-auth/middleware";

/**
 * Route protection. `next-auth/middleware` redirects unauthenticated users to
 * the sign-in page, then back to the dashboard after login.
 *
 * The matcher protects app routes while leaving auth endpoints, Next internals
 * and static assets public. RBAC is still enforced server-side by the backend
 * on every API call — this middleware is only a UX gate.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/auth (NextAuth endpoints)
     * - /_next/static, /_next/image (Next internals)
     * - /favicon.ico and common static files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
