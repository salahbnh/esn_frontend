import { ContractDetailView } from "@/features/contracts/pages/contract-detail";

/**
 * Contract detail. No role redirect here — RH/MANAGER/DIRECTION see the full
 * view; the backend enforces access. `params` is async (Next 15).
 */
export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ContractDetailView id={id} />;
}
