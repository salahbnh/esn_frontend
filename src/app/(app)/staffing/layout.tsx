import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { authOptions } from "@/lib/auth";

/**
 * Staffing area guard. CONSULTANT has no access to assignments (the backend
 * `/api/staffing` routes are RH/MANAGER/DIRECTION) → redirected to /dashboard.
 * A consultant sees their own assignments via /me/missions instead.
 */
export default async function StaffingLayout({
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
