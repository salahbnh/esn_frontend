"use client";

/**
 * CONSULTANT self-dashboard: own active allocation + active-assignments count,
 * and a list of active missions (project, client, allocation, dates). A 404
 * from `/reports/me` (no consultant profile) renders a graceful EmptyState.
 */

import { LayoutDashboard as PageIcon } from "lucide-react";
import { Briefcase, Percent } from "lucide-react";

import { KpiCard } from "@/components/common/kpi-card";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/async-states";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { formatInt } from "@/features/reporting/charts/chart-theme";
import { QueryBoundary } from "@/features/reporting/query-boundary";
import { useMyDashboard } from "@/features/reporting/use-reporting";
import type { OwnDashboard } from "@/features/reporting/reporting.types";

export function ConsultantDashboard({ name }: { name?: string | null }) {
  const query = useMyDashboard();

  return (
    <section className="space-y-6">
      <PageHeader icon={PageIcon} accent="dashboard"
        title={`${fr.dashboard.greeting}${name ? `, ${name}` : ""}`}
        subtitle={fr.dashboard.subtitle}
      />
      <QueryBoundary
        query={query}
        notFound={{
          title: fr.dashboard.noConsultantProfile,
          hint: fr.dashboard.noConsultantProfileHint,
        }}
      >
        {(data) => <ConsultantContent data={data} />}
      </QueryBoundary>
    </section>
  );
}

function ConsultantContent({ data }: { data: OwnDashboard }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard
          label={fr.dashboard.myOccupancy}
          value={`${Math.round(data.activeAllocationPct)}%`}
          icon={Percent}
          accent="cons"
        />
        <KpiCard
          label={fr.reports.activeMissions}
          value={formatInt(data.activeAssignmentsCount)}
          icon={Briefcase}
          accent="mgr"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{fr.dashboard.myMissions}</CardTitle>
        </CardHeader>
        <CardContent>
          {data.activeMissions.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="divide-y">
              {data.activeMissions.map((m) => (
                <li
                  key={m.missionId}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{m.project}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {m.clientName}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium tabular-nums text-role-cons">
                      {Math.round(m.allocationPct)}%
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatDate(m.startDate)} – {formatDate(m.endDate)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
