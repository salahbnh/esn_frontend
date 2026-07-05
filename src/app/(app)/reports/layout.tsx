import { ChartColumn as PageIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/common/page-header";
import { authOptions } from "@/lib/auth";
import { canSeeHrReports } from "@/lib/rbac";
import { fr } from "@/lib/i18n/fr";
import { ReportsTabs, type ReportTab } from "@/features/reporting/reports-tabs";

/**
 * Reports shell: a header + a role-gated sub-nav (Occupation · Missions ·
 * Pipeline · RH). Pipeline + RH tabs are RH/DIRECTION only. CONSULTANT has no
 * access to the reports area at all → redirected to /dashboard.
 */
export default async function ReportsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;

  if (role === "CONSULTANT" || role === null) {
    redirect("/dashboard");
  }

  const tabs: ReportTab[] = [
    { href: "/reports/occupancy", label: fr.reports.occupancy },
    { href: "/reports/missions", label: fr.reports.missions },
  ];
  if (canSeeHrReports(role)) {
    tabs.push(
      { href: "/reports/pipeline", label: fr.reports.pipeline },
      { href: "/reports/hr", label: fr.reports.hr },
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader icon={PageIcon} accent="reports" title={fr.reports.title} subtitle={fr.reports.subtitle} />
      <ReportsTabs tabs={tabs} />
      <div>{children}</div>
    </section>
  );
}
