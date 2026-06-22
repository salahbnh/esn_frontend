"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fr } from "@/lib/i18n/fr";
import { ASSIGNMENT_STATUSES, type AssignmentStatus } from "@/lib/types";
import { useConsultants } from "@/features/consultants/use-consultants";
import { useMissions } from "@/features/missions/use-missions";

const ALL = "ALL";

export interface AssignmentFiltersState {
  status: AssignmentStatus | undefined;
  missionId: string | undefined;
  consultantId: string | undefined;
}

/** Status + mission + consultant dropdowns for the assignments list. */
export function AssignmentFilters({
  state,
  onChange,
}: {
  state: AssignmentFiltersState;
  onChange: (patch: Partial<AssignmentFiltersState>) => void;
}) {
  const missions = useMissions({ pageSize: 100 }).data?.data ?? [];
  const consultants = useConsultants({ pageSize: 100 }).data?.data ?? [];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
      <Select
        value={state.status ?? ALL}
        onValueChange={(v) =>
          onChange({ status: v === ALL ? undefined : (v as AssignmentStatus) })
        }
      >
        <SelectTrigger className="lg:w-48" aria-label={fr.staffing.status}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{fr.staffing.allStatuses}</SelectItem>
          {ASSIGNMENT_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {fr.status.assignment[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={state.missionId ?? ALL}
        onValueChange={(v) => onChange({ missionId: v === ALL ? undefined : v })}
      >
        <SelectTrigger className="lg:w-56" aria-label={fr.staffing.mission}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{fr.staffing.allMissions}</SelectItem>
          {missions.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.project}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={state.consultantId ?? ALL}
        onValueChange={(v) =>
          onChange({ consultantId: v === ALL ? undefined : v })
        }
      >
        <SelectTrigger className="lg:w-56" aria-label={fr.staffing.consultant}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{fr.staffing.allConsultants}</SelectItem>
          {consultants.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.user.firstName} {c.user.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
