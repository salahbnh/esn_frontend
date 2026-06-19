"use client";

import { OccupancyBlock } from "@/features/reporting/charts/occupancy-block";
import { QueryBoundary } from "@/features/reporting/query-boundary";
import { useOccupancy } from "@/features/reporting/use-reporting";

export function OccupancyReportView() {
  const query = useOccupancy();
  return (
    <QueryBoundary query={query}>
      {(data) => <OccupancyBlock data={data} />}
    </QueryBoundary>
  );
}
