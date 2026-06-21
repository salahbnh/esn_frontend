"use client";

import Link from "next/link";

import { StatusBadge } from "@/components/common/status-badge";
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
import type { Candidate } from "@/features/recruitment/recruitment.types";

/** Read-only table of candidates. Name links to the detail page. */
export function CandidateTable({ candidates }: { candidates: Candidate[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{fr.candidates.name}</TableHead>
          <TableHead>{fr.candidates.email}</TableHead>
          <TableHead className="hidden md:table-cell">
            {fr.candidates.targetPosition}
          </TableHead>
          <TableHead className="hidden lg:table-cell">
            {fr.candidates.source}
          </TableHead>
          <TableHead>{fr.candidates.status}</TableHead>
          <TableHead className="hidden sm:table-cell">
            {fr.candidates.appliedAt}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidates.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <Link
                href={`/candidates/${c.id}`}
                className="font-medium text-primary hover:underline"
              >
                {c.firstName} {c.lastName}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">{c.email}</TableCell>
            <TableCell className="hidden md:table-cell">
              {c.targetPosition ?? "—"}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-muted-foreground">
              {c.source ?? "—"}
            </TableCell>
            <TableCell>
              <StatusBadge kind="candidate" value={c.status} />
            </TableCell>
            <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
              {formatDate(c.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
