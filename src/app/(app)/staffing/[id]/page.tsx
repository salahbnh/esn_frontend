import { AssignmentDetailView } from "@/features/staffing/pages/assignment-detail";

/** Assignment detail (RH/MANAGER/DIRECTION — gated by the staffing layout). */
export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AssignmentDetailView id={id} />;
}
