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
import type { MissionListItem } from "@/features/missions/missions.types";

/** Read-only table of missions. Project links to the detail page. */
export function MissionTable({ missions }: { missions: MissionListItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{fr.missions.project}</TableHead>
          <TableHead>{fr.missions.client}</TableHead>
          <TableHead className="hidden md:table-cell">
            {fr.missions.role}
          </TableHead>
          <TableHead>{fr.missions.status}</TableHead>
          <TableHead className="hidden lg:table-cell">
            {fr.missions.tjm}
          </TableHead>
          <TableHead className="hidden sm:table-cell">
            {fr.missions.startDate}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {missions.map((m) => (
          <TableRow key={m.id}>
            <TableCell>
              <Link
                href={`/missions/${m.id}`}
                className="font-medium text-primary hover:underline"
              >
                {m.project}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {m.client.name}
            </TableCell>
            <TableCell className="hidden md:table-cell">{m.role}</TableCell>
            <TableCell>
              <StatusBadge kind="mission" value={m.status} />
            </TableCell>
            <TableCell className="hidden lg:table-cell tabular-nums">
              {formatTJM(m.tjm)}
            </TableCell>
            <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
              {formatDate(m.startDate)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
