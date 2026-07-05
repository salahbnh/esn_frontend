"use client";

import { Award, Banknote, Briefcase, CalendarCheck, CalendarDays, Mail, Tags } from "lucide-react";
import { InfoField, InfoGrid } from "@/components/common/info-grid";

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
    <InfoGrid>
      <InfoField label={fr.consultants.email} icon={Mail}>{consultant.user.email}</InfoField>
      <InfoField label={fr.consultants.assignmentCount} icon={Briefcase}>
        <span className="tabular-nums">{consultant._assignmentCount}</span>
      </InfoField>
      <InfoField label={fr.consultants.tjm} icon={Banknote}>{formatTJM(consultant.tjm)}</InfoField>
      <InfoField label={fr.consultants.seniority} icon={Award}>
        {consultant.seniority ?? "—"}
      </InfoField>
      <InfoField label={fr.consultants.hireDate} icon={CalendarDays}>
        {formatDate(consultant.hireDate)}
      </InfoField>
      <InfoField label={fr.consultants.availabilityDate} icon={CalendarCheck}>
        {formatDate(consultant.availabilityDate)}
      </InfoField>
      <InfoField label={fr.consultants.skills} icon={Tags}>
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
      </InfoField>
      <InfoField label={fr.consultants.bio} full>
        <span className="whitespace-pre-wrap">{consultant.bio ?? "—"}</span>
      </InfoField>
    </InfoGrid>
  );
}

