"use client";

import { useState } from "react";

import {
  DateRangeFilter,
  defaultDateWindow,
} from "@/components/common/date-range-filter";
import { MissionsBlock } from "@/features/reporting/charts/missions-block";
import { QueryBoundary } from "@/features/reporting/query-boundary";
import { useMissions } from "@/features/reporting/use-reporting";

export function MissionsReportView() {
  const [window, setWindow] = useState(defaultDateWindow);
  const query = useMissions(window);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangeFilter value={window} onChange={setWindow} />
      </div>
      <QueryBoundary query={query}>
        {(data) => <MissionsBlock data={data} />}
      </QueryBoundary>
    </div>
  );
}
