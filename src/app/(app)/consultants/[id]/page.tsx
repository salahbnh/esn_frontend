import { ConsultantDetailView } from "@/features/consultants/pages/consultant-detail";

/** Consultant detail. `params` is async in Next 15 App Router. */
export default async function ConsultantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ConsultantDetailView id={id} />;
}
