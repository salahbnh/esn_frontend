import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { authOptions } from "@/lib/auth";
import { canSeeHrReports } from "@/lib/rbac";
import { fr } from "@/lib/i18n/fr";
import { PipelineReportView } from "@/features/reporting/pages/pipeline-report";

export const metadata: Metadata = {
  title: `${fr.reports.pipeline} · ${fr.reports.title}`,
};

/** RH/DIRECTION only — guarded server-side as defense-in-depth (the layout also
 * hides the tab, and the backend returns 403). */
export default async function PipelineReportPage() {
  const session = await getServerSession(authOptions);
  if (!canSeeHrReports(session?.user?.role ?? null)) {
    redirect("/dashboard");
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{fr.reports.pipelineTitle}</h2>
        <p className="text-sm text-muted-foreground">
          {fr.reports.pipelineSubtitle}
        </p>
      </div>
      <PipelineReportView />
    </section>
  );
}
