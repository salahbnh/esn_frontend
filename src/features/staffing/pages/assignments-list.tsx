"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { fr } from "@/lib/i18n/fr";
import {
  AssignmentFilters,
  type AssignmentFiltersState,
} from "@/features/staffing/components/assignment-filters";
import { AssignmentFormDialog } from "@/features/staffing/components/assignment-form-dialog";
import { AssignmentTable } from "@/features/staffing/components/assignment-table";
import { QueryBoundary } from "@/features/staffing/query-boundary";
import { useAssignments } from "@/features/staffing/use-staffing";

const PAGE_SIZE = 20;

/** Initial filters come from the URL (`?missionId=` / `?consultantId=`) via the page. */
export function AssignmentsListView({
  initialMissionId,
  initialConsultantId,
}: {
  initialMissionId?: string;
  initialConsultantId?: string;
}) {
  const { data: session } = useSession();
  const canManage =
    session?.user?.role === "MANAGER" || session?.user?.role === "DIRECTION";
  const [filters, setFilters] = useState<AssignmentFiltersState>({
    status: undefined,
    missionId: initialMissionId,
    consultantId: initialConsultantId,
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filters.status, filters.missionId, filters.consultantId]);

  const query = useMemo(
    () => ({
      status: filters.status,
      missionId: filters.missionId,
      consultantId: filters.consultantId,
      page,
      pageSize: PAGE_SIZE,
    }),
    [filters.status, filters.missionId, filters.consultantId, page],
  );
  const result = useAssignments(query);

  return (
    <section className="space-y-6">
      <PageHeader
        title={fr.staffing.title}
        subtitle={fr.staffing.subtitle}
        actions={
          canManage ? (
            <>
              <Button asChild variant="outline">
                <Link href="/staffing/occupancy">
                  {fr.staffing.occupancyTitle}
                </Link>
              </Button>
              <AssignmentFormDialog />
            </>
          ) : undefined
        }
      />

      <AssignmentFilters
        state={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
      />

      <QueryBoundary query={result}>
        {(data) =>
          data.data.length === 0 ? (
            <EmptyState
              title={fr.staffing.noResults}
              hint={fr.staffing.noResultsHint}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border">
                <AssignmentTable assignments={data.data} />
              </div>
              <Pagination
                page={data.page}
                pageSize={data.pageSize}
                total={data.total}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => p + 1)}
              />
            </div>
          )
        }
      </QueryBoundary>
    </section>
  );
}

function Pagination({
  page,
  pageSize,
  total,
  onPrev,
  onNext,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span className="tabular-nums">
        {total} {total > 1 ? "affectations" : "affectation"} · page {page} /{" "}
        {totalPages}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={page <= 1}>
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={page >= totalPages}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
