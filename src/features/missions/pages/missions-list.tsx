"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { fr } from "@/lib/i18n/fr";
import {
  MissionFilters,
  type MissionFiltersState,
} from "@/features/missions/components/mission-filters";
import { MissionFormDialog } from "@/features/missions/components/mission-form-dialog";
import { MissionTable } from "@/features/missions/components/mission-table";
import { QueryBoundary } from "@/features/missions/query-boundary";
import { useMissions } from "@/features/missions/use-missions";

const PAGE_SIZE = 20;

const EMPTY_FILTERS: MissionFiltersState = {
  status: undefined,
  clientId: undefined,
  search: "",
  includeArchived: false,
};

export function MissionsListView() {
  const { data: session } = useSession();
  const canManage =
    session?.user?.role === "MANAGER" || session?.user?.role === "DIRECTION";
  const [filters, setFilters] = useState<MissionFiltersState>(EMPTY_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(filters.search.trim()), 300);
    return () => clearTimeout(id);
  }, [filters.search]);

  useEffect(() => {
    setPage(1);
  }, [filters.status, filters.clientId, filters.includeArchived, debouncedSearch]);

  const query = useMemo(
    () => ({
      status: filters.status,
      clientId: filters.clientId,
      search: debouncedSearch || undefined,
      includeArchived: filters.includeArchived,
      page,
      pageSize: PAGE_SIZE,
    }),
    [filters.status, filters.clientId, filters.includeArchived, debouncedSearch, page],
  );
  const result = useMissions(query);

  return (
    <section className="space-y-6">
      <PageHeader
        title={fr.missions.title}
        subtitle={fr.missions.subtitle}
        actions={canManage ? <MissionFormDialog /> : undefined}
      />

      <MissionFilters
        state={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
      />

      <QueryBoundary query={result}>
        {(data) =>
          data.data.length === 0 ? (
            <EmptyState
              title={fr.missions.noResults}
              hint={fr.missions.noResultsHint}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border">
                <MissionTable missions={data.data} />
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
        {total} {total > 1 ? "missions" : "mission"} · page {page} / {totalPages}
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
