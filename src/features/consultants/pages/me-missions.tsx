"use client";

import { useState } from "react";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { QueryBoundary } from "@/features/consultants/query-boundary";
import { useOwnAssignments } from "@/features/consultants/use-consultants";

const PAGE_SIZE = 20;

export function MeMissionsView() {
  const [page, setPage] = useState(1);
  const query = useOwnAssignments({ page, pageSize: PAGE_SIZE });

  return (
    <section className="space-y-6">
      <PageHeader
        title={fr.consultants.myMissionsTitle}
        subtitle={fr.consultants.myMissionsSubtitle}
      />

      <QueryBoundary query={query}>
        {(data) =>
          data.data.length === 0 ? (
            <EmptyState
              title={fr.consultants.noMissions}
              hint={fr.consultants.noMissionsHint}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{fr.consultants.missionProject}</TableHead>
                      <TableHead>{fr.consultants.missionClient}</TableHead>
                      <TableHead className="hidden md:table-cell">
                        {fr.consultants.missionRole}
                      </TableHead>
                      <TableHead>{fr.consultants.allocation}</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        {fr.consultants.startDate}
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        {fr.consultants.endDate}
                      </TableHead>
                      <TableHead>{fr.candidates.status}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">
                          {a.mission.project}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {a.mission.client.name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {a.roleOnMission ?? "—"}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {a.allocationPct} %
                        </TableCell>
                        <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
                          {formatDate(a.startDate)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
                          {formatDate(a.endDate)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge kind="assignment" value={a.status} />
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
                    disabled={
                      data.page >= Math.ceil(data.total / data.pageSize)
                    }
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
