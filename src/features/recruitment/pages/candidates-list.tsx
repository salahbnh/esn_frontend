"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { fr } from "@/lib/i18n/fr";
import type { CandidateStatus } from "@/lib/types";
import { CandidateFilters } from "@/features/recruitment/components/candidate-filters";
import { CandidateTable } from "@/features/recruitment/components/candidate-table";
import { CreateCandidateDialog } from "@/features/recruitment/components/create-candidate-dialog";
import { QueryBoundary } from "@/features/recruitment/query-boundary";
import { useCandidates } from "@/features/recruitment/use-recruitment";

const PAGE_SIZE = 20;

export function CandidatesListView() {
  const { data: session } = useSession();
  const isRh = session?.user?.role === "RH";
  const [status, setStatus] = useState<CandidateStatus | undefined>();
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

  const result = useCandidates(query);

  return (
    <section className="space-y-6">
      <PageHeader
        title={fr.candidates.title}
        subtitle={fr.candidates.subtitle}
        actions={isRh ? <CreateCandidateDialog /> : undefined}
      />

      <CandidateFilters
        status={status}
        search={searchInput}
        onStatusChange={setStatus}
        onSearchChange={setSearchInput}
      />

      <QueryBoundary query={result}>
        {(data) =>
          data.data.length === 0 ? (
            <EmptyState
              title={fr.candidates.noResults}
              hint={fr.candidates.noResultsHint}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border">
                <CandidateTable candidates={data.data} />
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
        {total} {total > 1 ? "candidats" : "candidat"} · page {page} / {totalPages}
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
