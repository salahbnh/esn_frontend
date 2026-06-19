"use client";

import { useState } from "react";

import {
  DateRangeFilter,
  defaultDateWindow,
} from "@/components/common/date-range-filter";
import { PipelineBlock } from "@/features/reporting/charts/pipeline-block";
import { QueryBoundary } from "@/features/reporting/query-boundary";
import { usePipeline } from "@/features/reporting/use-reporting";

export function PipelineReportView() {
  const [window, setWindow] = useState(defaultDateWindow);
  const query = usePipeline(window);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangeFilter value={window} onChange={setWindow} />
      </div>
      <QueryBoundary query={query}>
        {(data) => <PipelineBlock data={data} />}
      </QueryBoundary>
    </div>
  );
}
