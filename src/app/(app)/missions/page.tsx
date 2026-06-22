import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { authOptions } from "@/lib/auth";
import { fr } from "@/lib/i18n/fr";
import { MissionsListView } from "@/features/missions/pages/missions-list";

export const metadata: Metadata = {
  title: fr.missions.title,
};

/**
 * Missions directory. The CONSULTANT redirect is on THIS list page (not a
 * shared layout) so that `/missions/:id` stays reachable for a consultant's
 * own-assigned, redacted read. RH/MANAGER/DIRECTION browse the list.
 */
export default async function MissionsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;

  if (role === "CONSULTANT" || role === null) {
    redirect("/dashboard");
  }

  return <MissionsListView />;
}
