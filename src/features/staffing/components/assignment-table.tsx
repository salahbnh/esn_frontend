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
import type { Assignment } from "@/features/staffing/staffing.types";

/** Read-only table of assignments. Links to the assignment, mission, and consultant. */
export function AssignmentTable({ assignments }: { assignments: Assignment[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{fr.staffing.mission}</TableHead>
          <TableHead>{fr.staffing.consultant}</TableHead>
          <TableHead className="hidden md:table-cell">
            {fr.staffing.roleOnMission}
          </TableHead>
          <TableHead>{fr.staffing.allocation}</TableHead>
          <TableHead>{fr.staffing.status}</TableHead>
          <TableHead className="hidden sm:table-cell">
            {fr.staffing.startDate}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((a) => (
          <TableRow key={a.id}>
            <TableCell>
              <Link
                href={`/staffing/${a.id}`}
                className="font-medium text-primary hover:underline"
              >
                {a.mission.project}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {a.consultant.user.firstName} {a.consultant.user.lastName}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {a.roleOnMission ?? "—"}
            </TableCell>
            <TableCell className="tabular-nums">{a.allocationPct} %</TableCell>
            <TableCell>
              <StatusBadge kind="assignment" value={a.status} />
            </TableCell>
            <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
              {formatDate(a.startDate)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
