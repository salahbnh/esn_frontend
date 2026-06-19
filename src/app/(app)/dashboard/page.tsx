import { getServerSession } from "next-auth";
import type { Metadata } from "next";

import { authOptions } from "@/lib/auth";
import { fr } from "@/lib/i18n/fr";
import { Dashboard } from "@/features/reporting/dashboard";

export const metadata: Metadata = {
  title: fr.dashboard.title,
};

/**
 * Role-aware dashboard. Server component reads the session role and hands it to
 * the client <Dashboard>, which branches: RH/DIRECTION → full summary,
 * MANAGER → occupancy + missions only, CONSULTANT → the /me self-dashboard.
 */
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name ?? session?.user?.email ?? "";
  const role = session?.user?.role ?? null;

  return <Dashboard role={role} name={name} />;
}
