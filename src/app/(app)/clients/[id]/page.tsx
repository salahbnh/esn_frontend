import { ClientDetailView } from "@/features/clients/pages/client-detail";

/** Client detail. `params` is async in Next 15 App Router. */
export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientDetailView id={id} />;
}
