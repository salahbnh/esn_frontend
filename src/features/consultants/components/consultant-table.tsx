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
import { formatDate, formatTJM } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import type { ConsultantListItem } from "@/features/consultants/consultants.types";

/** Read-only table of consultants. Name links to the detail page. */
export function ConsultantTable({
  consultants,
}: {
  consultants: ConsultantListItem[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{fr.consultants.name}</TableHead>
          <TableHead>{fr.consultants.position}</TableHead>
          <TableHead>{fr.consultants.tjm}</TableHead>
          <TableHead>{fr.candidates.status}</TableHead>
          <TableHead className="hidden sm:table-cell">
            {fr.consultants.availabilityDate}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {consultants.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <Link
                href={`/consultants/${c.id}`}
                className="font-medium text-primary hover:underline"
              >
                {c.user.firstName} {c.user.lastName}
              </Link>
            </TableCell>
            <TableCell>{c.position}</TableCell>
            <TableCell className="tabular-nums">{formatTJM(c.tjm)}</TableCell>
            <TableCell>
              <StatusBadge kind="consultant" value={c.status} />
            </TableCell>
            <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
              {formatDate(c.availabilityDate)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
