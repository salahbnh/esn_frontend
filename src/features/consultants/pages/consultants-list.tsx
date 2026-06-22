"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { fr } from "@/lib/i18n/fr";
import type { ConsultantStatus } from "@/lib/types";
import { ConsultantFilters } from "@/features/consultants/components/consultant-filters";
import { ConsultantTable } from "@/features/consultants/components/consultant-table";
import { QueryBoundary } from "@/features/consultants/query-boundary";
import { useConsultants } from "@/features/consultants/use-consultants";

const PAGE_SIZE = 20;

export function ConsultantsListView() {
  const [status, setStatus] = useState<ConsultantStatus | undefined>();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce the search box so we don't refetch on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Any filter change resets to the first page.
  useEffect(() => {
    setPage(1);
  }, [status, search]);

  const query = useMemo(
    () => ({
      status,
      search: search || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [status, search, page],
  );

  const result = useConsultants(query);

  return (
    <section className="space-y-6">
      <PageHeader
        title={fr.consultants.title}
        subtitle={fr.consultants.subtitle}
      />

      <ConsultantFilters
        status={status}
        search={searchInput}
        onStatusChange={setStatus}
        onSearchChange={setSearchInput}
      />

      <QueryBoundary query={result}>
        {(data) =>
          data.data.length === 0 ? (
            <EmptyState
              title={fr.consultants.noResults}
              hint={fr.consultants.noResultsHint}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border">
                <ConsultantTable consultants={data.data} />
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
        {total} {total > 1 ? "consultants" : "consultant"} · page {page} /{" "}
        {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={page <= 1}
        >
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
