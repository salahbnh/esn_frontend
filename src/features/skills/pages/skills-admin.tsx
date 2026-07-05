"use client";

import { Tag as PageIcon } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/common/async-states";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fr } from "@/lib/i18n/fr";
import { DeleteSkillButton } from "@/features/skills/components/delete-skill-button";
import { SkillFormDialog } from "@/features/skills/components/skill-form-dialog";
import { QueryBoundary } from "@/features/skills/query-boundary";
import { useSkills } from "@/features/skills/use-skills";

/** RH/DIRECTION skills referential admin: search, create, edit, delete. */
export function SkillsAdminView() {
  const [search, setSearch] = useState("");
  const query = useSkills({ pageSize: 200 });

  return (
    <section className="space-y-6">
      <PageHeader icon={PageIcon} accent="skills"
        title={fr.skills.title}
        subtitle={fr.skills.subtitle}
        actions={<SkillFormDialog />}
      />

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={fr.skills.searchPlaceholder}
        className="max-w-sm"
      />

      <QueryBoundary query={query}>
        {(list) => {
          const q = search.trim().toLowerCase();
          const rows = q
            ? list.data.filter((s) => s.name.toLowerCase().includes(q))
            : list.data;

          if (rows.length === 0) {
            return (
              <EmptyState title={fr.skills.noResults} hint={fr.skills.noResultsHint} />
            );
          }

          return (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{fr.skills.name}</TableHead>
                    <TableHead>{fr.skills.category}</TableHead>
                    <TableHead className="text-right">{fr.skills.edit}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>
                        {s.category ? (
                          <Badge variant="secondary">{s.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <SkillFormDialog skill={s} />
                          <DeleteSkillButton skillId={s.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        }}
      </QueryBoundary>
    </section>
  );
}
