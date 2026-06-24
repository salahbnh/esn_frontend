import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { authOptions } from "@/lib/auth";
import { fr } from "@/lib/i18n/fr";
import { ContractsListView } from "@/features/contracts/pages/contracts-list";

export const metadata: Metadata = {
  title: fr.contracts.title,
};

/**
 * Contracts directory (RH / MANAGER / DIRECTION). A CONSULTANT has no list
 * view — their single contract lives under `/me/contract` (a later slice), so
 * they are redirected to the dashboard here.
 */
export default async function ContractsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;

  if (role === "CONSULTANT" || role === null) {
    redirect("/dashboard");
  }

  return <ContractsListView />;
}
