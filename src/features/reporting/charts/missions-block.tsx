"use client";

/**
 * Missions report block: a bar chart of missions by status (FR labels) plus
 * KPI cards for active / forecast counts and average duration (— when null).
 */

import { Briefcase, CalendarClock, Timer } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/common/chart-card";
import { KpiCard } from "@/components/common/kpi-card";
import { fr } from "@/lib/i18n/fr";
import {
  axisStyle,
  chartColor,
  formatInt,
  gridStroke,
  tooltipIntFormatter,
  tooltipStyle,
} from "@/features/reporting/charts/chart-theme";
import { reportMissionLabel } from "@/features/reporting/report-labels";
import {
  REPORT_MISSION_STATUSES,
  type MissionsReport,
} from "@/features/reporting/reporting.types";

export function MissionsBlock({ data }: { data: MissionsReport }) {
  const byStatus = REPORT_MISSION_STATUSES.map((status, i) => ({
    label: reportMissionLabel(status),
    value: data.byStatus[status] ?? 0,
    fill: chartColor(i),
  }));
  const isEmpty = data.totalMissions === 0;

  const avgDuration =
    data.avgDurationDays === null
      ? "—"
      : formatInt(Math.round(data.avgDurationDays));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label={fr.reports.activeMissions}
          value={formatInt(data.activeCount)}
          icon={Briefcase}
          accent="mgr"
        />
        <KpiCard
          label={fr.reports.forecastMissions}
          value={formatInt(data.forecastCount)}
          icon={CalendarClock}
          accent="dir"
        />
        <KpiCard
          label={fr.reports.avgDuration}
          value={avgDuration}
          icon={Timer}
          accent="accent"
        />
      </div>

      <ChartCard
        title={fr.reports.missionsByStatus}
        description={`${formatInt(data.totalMissions)} ${fr.reports.totalMissions.toLowerCase()}`}
        isEmpty={isEmpty}
      >
        <BarChart
          data={byStatus}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <CartesianGrid vertical={false} stroke={gridStroke} />
          <XAxis dataKey="label" {...axisStyle} tickLine={false} />
          <YAxis allowDecimals={false} {...axisStyle} tickLine={false} />
          <Tooltip {...tooltipStyle} formatter={tooltipIntFormatter} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} name={fr.reports.missions}>
            {byStatus.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartCard>
    </div>
  );
}
