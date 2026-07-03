import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { authOptions } from "@/lib/auth";

/**
 * Job posts admin area — RH / MANAGER / DIRECTION. CONSULTANT is redirected.
 * Write actions (create/edit/publish/link) are further gated in the pages and
 * enforced server-side by the API.
 */
export default async function JobPostsLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;
  if (role !== "RH" && role !== "MANAGER" && role !== "DIRECTION") {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
