import type { Metadata } from "next";

import { fr } from "@/lib/i18n/fr";
import { AssignmentsListView } from "@/features/staffing/pages/assignments-list";

export const metadata: Metadata = {
  title: fr.staffing.title,
};

/**
 * Assignments directory (RH/MANAGER/DIRECTION — gated by the staffing layout).
 * Deep links from missions/consultants pass `?missionId=` / `?consultantId=` as
 * initial filters (read here, server-side, then handed to the client view).
 */
export default async function StaffingPage({
  searchParams,
}: {
  searchParams: Promise<{ missionId?: string; consultantId?: string }>;
}) {
  const { missionId, consultantId } = await searchParams;
  return (
    <AssignmentsListView
      initialMissionId={missionId}
      initialConsultantId={consultantId}
    />
  );
}
