import { MissionDetailView } from "@/features/missions/pages/mission-detail";

/**
 * Mission detail. No role redirect here — RH/MANAGER/DIRECTION see the full
 * view; a CONSULTANT may view a mission they're assigned to (the backend
 * enforces ownership and redacts TJM + client contact). `params` is async.
 */
export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MissionDetailView id={id} />;
}
