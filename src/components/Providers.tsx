"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/** Client boundary that makes the NextAuth session available to client hooks. */
export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
