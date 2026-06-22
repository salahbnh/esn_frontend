"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { formatDate, formatTJM } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import type { ConsultantDetail } from "@/features/consultants/consultants.types";

/** Read-only consultant profile fields. Shared by the staff detail and /me. */
export function ConsultantProfile({
  consultant,
}: {
  consultant: ConsultantDetail;
}) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      <Field label={fr.consultants.email}>{consultant.user.email}</Field>
      <Field label={fr.consultants.assignmentCount}>
        <span className="tabular-nums">{consultant._assignmentCount}</span>
      </Field>
      <Field label={fr.consultants.tjm}>{formatTJM(consultant.tjm)}</Field>
      <Field label={fr.consultants.seniority}>
        {consultant.seniority ?? "—"}
      </Field>
      <Field label={fr.consultants.hireDate}>
        {formatDate(consultant.hireDate)}
      </Field>
      <Field label={fr.consultants.availabilityDate}>
        {formatDate(consultant.availabilityDate)}
      </Field>
      <Field label={fr.consultants.skills}>
        {consultant.skills.length > 0 ? (
          <span className="flex flex-wrap gap-1.5">
            {consultant.skills.map((s) => (
              <Badge key={s.id} variant="secondary">
                {s.name}
              </Badge>
            ))}
          </span>
        ) : (
          "—"
        )}
      </Field>
      <Field label={fr.consultants.bio} full>
        <span className="whitespace-pre-wrap">{consultant.bio ?? "—"}</span>
      </Field>
    </dl>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}
