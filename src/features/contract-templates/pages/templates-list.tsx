"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
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
import { DeactivateTemplateButton } from "@/features/contract-templates/components/deactivate-template-button";
import { TemplateFormDialog } from "@/features/contract-templates/components/template-form-dialog";
import { QueryBoundary } from "@/features/contract-templates/query-boundary";
import { useTemplatesAdmin } from "@/features/contract-templates/use-contract-templates";

export function TemplatesListView() {
  const [includeInactive, setIncludeInactive] = useState(false);
  const query = useMemo(
    () => ({ includeInactive, pageSize: 100 }),
    [includeInactive],
  );
  const result = useTemplatesAdmin(query);

  return (
    <section className="space-y-6">
      <Link
        href="/contracts"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {fr.templates.back}
      </Link>

      <PageHeader
        title={fr.templates.title}
        subtitle={fr.templates.subtitle}
        actions={<TemplateFormDialog />}
      />

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={includeInactive}
          onChange={(e) => setIncludeInactive(e.target.checked)}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        {fr.templates.includeInactive}
      </label>

      <QueryBoundary query={result}>
        {(data) =>
          data.data.length === 0 ? (
            <EmptyState
              title={fr.templates.noResults}
              hint={fr.templates.noResultsHint}
            />
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{fr.templates.name}</TableHead>
                    <TableHead>{fr.templates.status}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {fr.templates.updatedAt}
                    </TableHead>
                    <TableHead className="text-right">{fr.templates.manage}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>
                        <Badge variant={t.isActive ? "secondary" : "outline"}>
                          {t.isActive ? fr.templates.active : fr.templates.inactive}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
                        {formatDate(t.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <TemplateFormDialog template={t} />
                          {t.isActive ? (
                            <DeactivateTemplateButton templateId={t.id} />
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        }
      </QueryBoundary>
    </section>
  );
}
