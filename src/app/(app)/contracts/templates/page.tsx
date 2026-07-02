import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { authOptions } from "@/lib/auth";
import { fr } from "@/lib/i18n/fr";
import { TemplatesListView } from "@/features/contract-templates/pages/templates-list";

export const metadata: Metadata = {
  title: fr.templates.title,
};

/**
 * Contract templates management (RH / DIRECTION). Authoring the bodies that the
 * contract prefill engine fills. Others are redirected to the dashboard.
 */
export default async function ContractTemplatesPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;

  if (role !== "RH" && role !== "DIRECTION") {
    redirect("/dashboard");
  }

  return <TemplatesListView />;
}
