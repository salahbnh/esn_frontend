"use client";

import Link from "next/link";

import { fr } from "@/lib/i18n/fr";
import { OccupancyBadge } from "@/features/staffing/components/occupancy-badge";
import { useConsultantOccupancy } from "@/features/staffing/use-staffing";

/**
 * A consultant's current total allocation as a chip, linking to their filtered
 * assignments. Self-contained so the consultants feature can drop it in without
 * pulling in the rest of staffing.
 */
export function ConsultantOccupancyLink({
  consultantId,
}: {
  consultantId: string;
}) {
  const { data } = useConsultantOccupancy(consultantId);
  if (!data) return <span className="text-sm text-muted-foreground">—</span>;
  return (
    <Link
      href={`/staffing?consultantId=${consultantId}`}
      className="inline-flex items-center gap-2 hover:opacity-80"
      title={fr.staffing.title}
    >
      <OccupancyBadge pct={data.totalAllocationPct} />
    </Link>
  );
}
