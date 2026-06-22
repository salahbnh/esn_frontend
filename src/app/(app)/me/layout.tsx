import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { authOptions } from "@/lib/auth";

/**
 * Self-service area guard. Only CONSULTANT has a personal space here; RH /
 * MANAGER / DIRECTION are redirected to /dashboard (UX gate — the backend's
 * `/me` routes are CONSULTANT-only regardless).
 */
export default async function MeLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;

  if (role !== "CONSULTANT") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
