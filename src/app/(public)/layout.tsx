import type { ReactNode } from "react";

import { fr } from "@/lib/i18n/fr";

/**
 * Public careers shell — the ONLY unauthenticated area. No app nav, no session
 * dependency. A visitor never needs to log in. (The root SessionProvider still
 * wraps this, but nothing here reads the session or attaches a token.)
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <span className="font-semibold">{fr.app.name}</span>
          <span className="ml-2 text-sm text-muted-foreground">Carrières</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
