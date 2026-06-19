"use client";

/**
 * Recruitment pipeline block: a horizontal bar funnel APPLIED→…→HIRED (FR
 * labels) plus a total-candidates KPI.
 */

import { Users } from "lucide-react";
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
import { pipelineLabel } from "@/features/reporting/report-labels";
import {
  PIPELINE_STAGES,
  type PipelineReport,
} from "@/features/reporting/reporting.types";

export function PipelineBlock({ data }: { data: PipelineReport }) {
  const funnel = PIPELINE_STAGES.map((stage, i) => ({
    label: pipelineLabel(stage),
    value: data.funnel[stage] ?? 0,
    fill: chartColor(i),
  }));
  const isEmpty = data.total === 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label={fr.reports.totalCandidates}
          value={formatInt(data.total)}
          icon={Users}
          accent="primary"
        />
      </div>

      <ChartCard title={fr.reports.funnel} isEmpty={isEmpty} height={300}>
        <BarChart
          layout="vertical"
          data={funnel}
          margin={{ top: 8, right: 16, bottom: 0, left: 24 }}
        >
          <CartesianGrid horizontal={false} stroke={gridStroke} />
          <XAxis type="number" allowDecimals={false} {...axisStyle} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={90}
            {...axisStyle}
            tickLine={false}
          />
          <Tooltip {...tooltipStyle} formatter={tooltipIntFormatter} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} name={fr.reports.candidates}>
            {funnel.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartCard>
    </div>
  );
}
