"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { fr } from "@/lib/i18n/fr";
import { ContractCreateDialog } from "@/features/contracts/components/contract-create-dialog";
import {
  ContractFilters,
  type ContractFiltersState,
} from "@/features/contracts/components/contract-filters";
import { ContractTable } from "@/features/contracts/components/contract-table";
import { QueryBoundary } from "@/features/contracts/query-boundary";
import { useContracts } from "@/features/contracts/use-contracts";

const PAGE_SIZE = 20;

const EMPTY_FILTERS: ContractFiltersState = {
  status: undefined,
  search: "",
  includeArchived: false,
};

export function ContractsListView() {
  const { data: session } = useSession();
  const canAuthor =
    session?.user?.role === "RH" || session?.user?.role === "DIRECTION";
  const [filters, setFilters] = useState<ContractFiltersState>(EMPTY_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(filters.search.trim()), 300);
    return () => clearTimeout(id);
  }, [filters.search]);

  useEffect(() => {
    setPage(1);
  }, [filters.status, filters.includeArchived, debouncedSearch]);

  const query = useMemo(
    () => ({
      status: filters.status,
      search: debouncedSearch || undefined,
      includeArchived: filters.includeArchived,
      page,
      pageSize: PAGE_SIZE,
    }),
    [filters.status, filters.includeArchived, debouncedSearch, page],
  );
  const result = useContracts(query);

  return (
    <section className="space-y-6">
      <PageHeader
        title={fr.contracts.title}
        subtitle={fr.contracts.subtitle}
        actions={
          canAuthor ? (
            <>
              <Button asChild variant="outline">
                <Link href="/contracts/templates">
                  <FileText className="h-4 w-4" />
                  {fr.templates.manage}
                </Link>
              </Button>
              <ContractCreateDialog />
            </>
          ) : undefined
        }
      />

      <ContractFilters
        state={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
      />

      <QueryBoundary query={result}>
        {(data) =>
          data.data.length === 0 ? (
            <EmptyState
              title={fr.contracts.noResults}
              hint={fr.contracts.noResultsHint}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border">
                <ContractTable contracts={data.data} />
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
        {total} {total > 1 ? "contrats" : "contrat"} · page {page} / {totalPages}
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
