import { CandidateDetailView } from "@/features/recruitment/pages/candidate-detail";

/** Candidate detail. `params` is async in Next 15 App Router. */
export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CandidateDetailView id={id} />;
}
