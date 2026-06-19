"use client";

import { HrBlock } from "@/features/reporting/charts/hr-block";
import { QueryBoundary } from "@/features/reporting/query-boundary";
import { useHr } from "@/features/reporting/use-reporting";

export function HrReportView() {
  const query = useHr();
  return (
    <QueryBoundary query={query}>
      {(data) => <HrBlock data={data} />}
    </QueryBoundary>
  );
}
