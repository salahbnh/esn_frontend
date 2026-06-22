"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fr } from "@/lib/i18n/fr";
import { MISSION_STATUSES, type MissionStatus } from "@/lib/types";
import { useClients } from "@/features/clients/use-clients";

const ALL = "ALL";

export interface MissionFiltersState {
  status: MissionStatus | undefined;
  clientId: string | undefined;
  search: string;
  includeArchived: boolean;
}

/** Status + client dropdowns, search, and an "include archived" toggle. */
export function MissionFilters({
  state,
  onChange,
}: {
  state: MissionFiltersState;
  onChange: (patch: Partial<MissionFiltersState>) => void;
}) {
  // All clients for the filter dropdown (clients are few; one page is enough).
  const clientsQuery = useClients({ pageSize: 100 });
  const clients = clientsQuery.data?.data ?? [];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
      <div className="relative lg:max-w-xs lg:flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={state.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder={fr.missions.searchPlaceholder}
          aria-label={fr.missions.searchPlaceholder}
          className="pl-9"
        />
      </div>

      <Select
        value={state.status ?? ALL}
        onValueChange={(v) =>
          onChange({ status: v === ALL ? undefined : (v as MissionStatus) })
        }
      >
        <SelectTrigger className="lg:w-48" aria-label={fr.missions.status}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{fr.missions.allStatuses}</SelectItem>
          {MISSION_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {fr.status.mission[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={state.clientId ?? ALL}
        onValueChange={(v) =>
          onChange({ clientId: v === ALL ? undefined : v })
        }
      >
        <SelectTrigger className="lg:w-52" aria-label={fr.missions.client}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{fr.missions.allClients}</SelectItem>
          {clients.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={state.includeArchived}
          onChange={(e) => onChange({ includeArchived: e.target.checked })}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        {fr.missions.includeArchived}
      </label>
    </div>
  );
}
