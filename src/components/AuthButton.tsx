"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/Button";

/** Sign-in / sign-out control that reflects the current session + role. */
export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="text-sm text-slate-400" aria-live="polite">
        …
      </span>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          {session.user?.name ?? session.user?.email ?? "Signed in"}
          {session.role ? ` · ${session.role}` : ""}
        </span>
        <Button variant="secondary" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn("keycloak")}>Sign in</Button>
  );
}
