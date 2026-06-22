import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { authOptions } from "@/lib/auth";

/**
 * Clients area guard. Clients are org-level with no CONSULTANT access → a
 * CONSULTANT is redirected to /dashboard (UX gate; the backend rejects them
 * regardless). RH, MANAGER, and DIRECTION may all view and manage.
 */
export default async function ClientsLayout({
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
