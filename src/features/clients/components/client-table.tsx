"use client";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fr } from "@/lib/i18n/fr";
import type { Client } from "@/features/clients/clients.types";

/** Read-only table of clients. Name links to the detail page. */
export function ClientTable({ clients }: { clients: Client[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{fr.clients.name}</TableHead>
          <TableHead>{fr.clients.industry}</TableHead>
          <TableHead className="hidden sm:table-cell">
            {fr.clients.contactName}
          </TableHead>
          <TableHead className="hidden md:table-cell">
            {fr.clients.contactEmail}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <Link
                href={`/clients/${c.id}`}
                className="font-medium text-primary hover:underline"
              >
                {c.name}
              </Link>
            </TableCell>
            <TableCell>{c.industry ?? "—"}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {c.contactName ?? "—"}
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
              {c.contactEmail ?? "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
