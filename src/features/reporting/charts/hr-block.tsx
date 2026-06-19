"use client";

/**
 * HR report block: a donut of headcount by consultant status, an intercontrat
 * KPI, and a bar chart of contracts by status (all FR labels).
 */

import { Coffee, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
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
import {
  reportConsultantLabel,
  reportContractLabel,
} from "@/features/reporting/report-labels";
import {
  REPORT_CONSULTANT_STATUSES,
  REPORT_CONTRACT_STATUSES,
  type HrReport,
} from "@/features/reporting/reporting.types";

export function HrBlock({ data }: { data: HrReport }) {
  const headcount = REPORT_CONSULTANT_STATUSES.map((status, i) => ({
    label: reportConsultantLabel(status),
    value: data.headcount.byStatus[status] ?? 0,
    fill: chartColor(i),
  }));
  const headcountEmpty = data.headcount.total === 0;

  const contracts = REPORT_CONTRACT_STATUSES.map((status, i) => ({
    label: reportContractLabel(status),
    value: data.contractsByStatus[status] ?? 0,
    fill: chartColor(i),
  }));
  const contractsEmpty = contracts.every((c) => c.value === 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard
          label={fr.reports.headcount}
          value={formatInt(data.headcount.total)}
          icon={Users}
          accent="primary"
        />
        <KpiCard
          label={fr.reports.intercontratCount}
          value={formatInt(data.intercontratCount)}
          icon={Coffee}
          accent="rh"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title={fr.reports.headcountByStatus}
          isEmpty={headcountEmpty}
          height={280}
        >
          <PieChart>
            <Pie
              data={headcount}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
            >
              {headcount.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} formatter={tooltipIntFormatter} />
            <Legend
              wrapperStyle={{ fontSize: "0.8125rem" }}
              formatter={(value) => (
                <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
              )}
            />
          </PieChart>
        </ChartCard>

        <ChartCard
          title={fr.reports.contractsByStatus}
          isEmpty={contractsEmpty}
          height={280}
        >
          <BarChart
            data={contracts}
            margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
          >
            <CartesianGrid vertical={false} stroke={gridStroke} />
            <XAxis
              dataKey="label"
              {...axisStyle}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={56}
            />
            <YAxis allowDecimals={false} {...axisStyle} tickLine={false} />
            <Tooltip {...tooltipStyle} formatter={tooltipIntFormatter} />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              name={fr.reports.contractsByStatus}
            >
              {contracts.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>
      </div>
    </div>
  );
}
