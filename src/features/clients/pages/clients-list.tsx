"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fr } from "@/lib/i18n/fr";
import { ClientFormDialog } from "@/features/clients/components/client-form-dialog";
import { ClientTable } from "@/features/clients/components/client-table";
import { QueryBoundary } from "@/features/clients/query-boundary";
import { useClients } from "@/features/clients/use-clients";

const PAGE_SIZE = 20;

export function ClientsListView() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const query = useMemo(
    () => ({ search: search || undefined, page, pageSize: PAGE_SIZE }),
    [search, page],
  );
  const result = useClients(query);

  return (
    <section className="space-y-6">
      <PageHeader
        title={fr.clients.title}
        subtitle={fr.clients.subtitle}
        actions={<ClientFormDialog />}
      />

      <div className="relative sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={fr.clients.searchPlaceholder}
          aria-label={fr.clients.searchPlaceholder}
          className="pl-9"
        />
      </div>

      <QueryBoundary query={result}>
        {(data) =>
          data.data.length === 0 ? (
            <EmptyState
              title={fr.clients.noResults}
              hint={fr.clients.noResultsHint}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border">
                <ClientTable clients={data.data} />
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
        {total} {total > 1 ? "clients" : "client"} · page {page} / {totalPages}
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
