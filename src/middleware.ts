import { withAuth } from "next-auth/middleware";

/**
 * Route protection (UX gate only — the backend is the real authority on every
 * API call). `withAuth` redirects unauthenticated users to `/login`.
 *
 * Public: `/login`, `/jobs/*` (the public careers portal), `/api/auth/*`, Next
 * internals, and static assets. Everything else (the `(app)` group) requires a
 * session. NOTE: `/job-posts` (admin) does NOT start with `jobs`, so it stays protected.
 */
export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    /*
     * Protect all paths except:
     *  - /login (public login screen)
     *  - /jobs (public careers portal — unauthenticated)
     *  - /api/auth (NextAuth endpoints)
     *  - /_next/static, /_next/image (Next internals)
     *  - favicon and common static files
     */
    "/((?!login|jobs|api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
