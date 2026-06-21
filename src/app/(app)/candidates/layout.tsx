import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { authOptions } from "@/lib/auth";

/**
 * Recruitment area guard. CONSULTANT has no access to candidates → redirected
 * to /dashboard (UX gate; the backend rejects them regardless). RH, MANAGER,
 * and DIRECTION may view; finer per-action gating lives in the components.
 */
export default async function CandidatesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;

  if (role === "CONSULTANT" || role === null) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
