import type { Metadata } from "next";

import { fr } from "@/lib/i18n/fr";
import { MissionsReportView } from "@/features/reporting/pages/missions-report";

export const metadata: Metadata = {
  title: `${fr.reports.missions} · ${fr.reports.title}`,
};

export default function MissionsReportPage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{fr.reports.missionsTitle}</h2>
        <p className="text-sm text-muted-foreground">
          {fr.reports.missionsSubtitle}
        </p>
      </div>
      <MissionsReportView />
    </section>
  );
}
