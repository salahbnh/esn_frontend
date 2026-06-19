import type { Metadata } from "next";

import { fr } from "@/lib/i18n/fr";
import { OccupancyReportView } from "@/features/reporting/pages/occupancy-report";

export const metadata: Metadata = {
  title: `${fr.reports.occupancy} · ${fr.reports.title}`,
};

export default function OccupancyReportPage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{fr.reports.occupancyTitle}</h2>
        <p className="text-sm text-muted-foreground">
          {fr.reports.occupancySubtitle}
        </p>
      </div>
      <OccupancyReportView />
    </section>
  );
}
