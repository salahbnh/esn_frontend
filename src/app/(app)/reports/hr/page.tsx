import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { authOptions } from "@/lib/auth";
import { canSeeHrReports } from "@/lib/rbac";
import { fr } from "@/lib/i18n/fr";
import { HrReportView } from "@/features/reporting/pages/hr-report";

export const metadata: Metadata = {
  title: `${fr.reports.hr} · ${fr.reports.title}`,
};

/** RH/DIRECTION only — guarded server-side as defense-in-depth. */
export default async function HrReportPage() {
  const session = await getServerSession(authOptions);
  if (!canSeeHrReports(session?.user?.role ?? null)) {
    redirect("/dashboard");
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{fr.reports.hrTitle}</h2>
        <p className="text-sm text-muted-foreground">{fr.reports.hrSubtitle}</p>
      </div>
      <HrReportView />
    </section>
  );
}
