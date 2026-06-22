import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { authOptions } from "@/lib/auth";
import { fr } from "@/lib/i18n/fr";
import { OccupancyView } from "@/features/staffing/pages/occupancy";

export const metadata: Metadata = {
  title: fr.staffing.occupancyTitle,
};

/**
 * Global occupancy is MANAGER/DIRECTION only (the `GET /occupancy` route excludes
 * RH). RH can still read a single consultant's occupancy elsewhere, so we bounce
 * them back to the assignments list rather than the dashboard.
 */
export default async function OccupancyPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;

  if (role !== "MANAGER" && role !== "DIRECTION") {
    redirect("/staffing");
  }

  return <OccupancyView />;
}
