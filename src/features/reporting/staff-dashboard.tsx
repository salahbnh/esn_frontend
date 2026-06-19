"use client";

/**
 * Staff dashboard (RH / MANAGER / DIRECTION). Calls `/reports/summary` and
 * renders only the blocks the backend returned for the role: occupancy +
 * missions always; pipeline + hr for RH/DIRECTION (omitted for MANAGER).
 */

import { PageHeader } from "@/components/common/page-header";
import { fr } from "@/lib/i18n/fr";
import { OccupancyBlock } from "@/features/reporting/charts/occupancy-block";
import { MissionsBlock } from "@/features/reporting/charts/missions-block";
import { PipelineBlock } from "@/features/reporting/charts/pipeline-block";
import { HrBlock } from "@/features/reporting/charts/hr-block";
import { QueryBoundary } from "@/features/reporting/query-boundary";
import { useSummary } from "@/features/reporting/use-reporting";

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

export function StaffDashboard({ name }: { name?: string | null }) {
  const query = useSummary();

  return (
    <section className="space-y-6">
      <PageHeader
        title={`${fr.dashboard.greeting}${name ? `, ${name}` : ""}`}
        subtitle={fr.dashboard.subtitle}
      />
      <QueryBoundary query={query}>
        {(data) => (
          <div className="space-y-8">
            <div className="space-y-3">
              <SectionTitle>{fr.reports.occupancyTitle}</SectionTitle>
              <OccupancyBlock data={data.occupancy} />
            </div>

            <div className="space-y-3">
              <SectionTitle>{fr.reports.missionsTitle}</SectionTitle>
              <MissionsBlock data={data.missions} />
            </div>

            {data.pipeline ? (
              <div className="space-y-3">
                <SectionTitle>{fr.reports.pipelineTitle}</SectionTitle>
                <PipelineBlock data={data.pipeline} />
              </div>
            ) : null}

            {data.hr ? (
              <div className="space-y-3">
                <SectionTitle>{fr.reports.hrTitle}</SectionTitle>
                <HrBlock data={data.hr} />
              </div>
            ) : null}
          </div>
        )}
      </QueryBoundary>
    </section>
  );
}
