"use client";

/**
 * Occupancy visualisation: a radial gauge for the global average allocation,
 * KPI cards for the 3 consultant-status buckets, and a bar for the
 * full/partial/unassigned distribution. Theme-aware colors via CSS vars.
 */

import { CheckCircle2, Coffee, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/common/chart-card";
import { KpiCard } from "@/components/common/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { fr } from "@/lib/i18n/fr";
import {
  axisStyle,
  chartColor,
  formatInt,
  gridStroke,
  tooltipIntFormatter,
  tooltipStyle,
} from "@/features/reporting/charts/chart-theme";
import type { OccupancyReport } from "@/features/reporting/reporting.types";

export function OccupancyBlock({ data }: { data: OccupancyReport }) {
  const pct = Math.round(data.globalAvgAllocationPct);
  const gaugeData = [{ name: "occupation", value: pct, fill: chartColor(0) }];

  const distribution = [
    { key: "full", label: fr.reports.full, value: data.distribution.full },
    {
      key: "partial",
      label: fr.reports.partial,
      value: data.distribution.partial,
    },
    {
      key: "unassigned",
      label: fr.reports.unassigned,
      value: data.distribution.unassigned,
    },
  ];
  const distributionEmpty = distribution.every((d) => d.value === 0);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="flex flex-col">
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {fr.reports.globalAllocation}
          </p>
          <div className="relative h-44 w-44">
            <RadialBarChart
              width={176}
              height={176}
              cx="50%"
              cy="50%"
              innerRadius="72%"
              outerRadius="100%"
              barSize={14}
              data={gaugeData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: "hsl(var(--muted))" }}
                dataKey="value"
                cornerRadius={8}
                angleAxisId={0}
              />
            </RadialBarChart>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-semibold tabular-nums text-primary">
                {pct}%
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatInt(data.totalConsultants)} {fr.reports.consultants}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-2">
        <KpiCard
          label={fr.reports.onMission}
          value={formatInt(data.consultantsByStatus.ON_MISSION)}
          icon={Users}
          accent="mgr"
        />
        <KpiCard
          label={fr.reports.intercontrat}
          value={formatInt(data.consultantsByStatus.INTERCONTRAT)}
          icon={Coffee}
          accent="rh"
        />
        <KpiCard
          label={fr.reports.available}
          value={formatInt(data.consultantsByStatus.AVAILABLE)}
          icon={CheckCircle2}
          accent="cons"
        />

        <div className="sm:col-span-3">
          <ChartCard
            title={fr.reports.distribution}
            isEmpty={distributionEmpty}
            height={200}
          >
            <BarChart
              data={distribution}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <CartesianGrid vertical={false} stroke={gridStroke} />
              <XAxis dataKey="label" {...axisStyle} tickLine={false} />
              <YAxis allowDecimals={false} {...axisStyle} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={tooltipIntFormatter} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} name={fr.reports.distribution}>
                {distribution.map((_, i) => (
                  <Cell key={i} fill={chartColor(i)} />
                ))}
              </Bar>
            </BarChart>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
