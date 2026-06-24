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
import type { Contract } from "@/features/contracts/contracts.types";

/** Read-only table of contracts. Consultant name links to the detail page. */
export function ContractTable({ contracts }: { contracts: Contract[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{fr.contracts.consultant}</TableHead>
          <TableHead>{fr.contracts.type}</TableHead>
          <TableHead>{fr.contracts.status}</TableHead>
          <TableHead className="hidden sm:table-cell">
            {fr.contracts.startDate}
          </TableHead>
          <TableHead className="hidden md:table-cell">
            {fr.contracts.endDate}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <Link
                href={`/contracts/${c.id}`}
                className="font-medium text-primary hover:underline"
              >
                {c.consultant.user.firstName} {c.consultant.user.lastName}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">{c.type}</TableCell>
            <TableCell>
              <StatusBadge kind="contract" value={c.status} />
            </TableCell>
            <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
              {formatDate(c.startDate)}
            </TableCell>
            <TableCell className="hidden md:table-cell tabular-nums text-muted-foreground">
              {formatDate(c.endDate)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
