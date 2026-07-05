"use client";

import { Gauge as PageIcon } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fr } from "@/lib/i18n/fr";
import { OccupancyBadge } from "@/features/staffing/components/occupancy-badge";
import { QueryBoundary } from "@/features/staffing/query-boundary";
import { useGlobalOccupancy } from "@/features/staffing/use-staffing";

const PAGE_SIZE = 20;

/** Global occupancy — consultants and their total ACTIVE allocation (MGR/DIR). */
export function OccupancyView() {
  const [page, setPage] = useState(1);
  const result = useGlobalOccupancy({ page, pageSize: PAGE_SIZE });

  return (
    <section className="space-y-6">
      <PageHeader icon={PageIcon} accent="staffing"
        title={fr.staffing.occupancyTitle}
        subtitle={fr.staffing.occupancySubtitle}
      />

      <QueryBoundary query={result}>
        {(data) =>
          data.data.length === 0 ? (
            <EmptyState title={fr.staffing.noResults} hint="" />
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{fr.staffing.consultant}</TableHead>
                      <TableHead>{fr.staffing.totalAllocation}</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        {fr.staffing.activeAssignments}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((o) => (
                      <TableRow key={o.consultant.id}>
                        <TableCell className="font-medium">
                          {o.consultant.name}
                        </TableCell>
                        <TableCell>
                          <OccupancyBadge pct={o.totalAllocationPct} />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
                          {o.assignmentCount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="tabular-nums">
                  {data.total} · page {data.page} /{" "}
                  {Math.max(1, Math.ceil(data.total / data.pageSize))}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={data.page <= 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={data.page >= Math.ceil(data.total / data.pageSize)}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </div>
          )
        }
      </QueryBoundary>
    </section>
  );
}
