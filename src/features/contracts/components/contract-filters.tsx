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
import { CONTRACT_STATUSES, type ContractStatus } from "@/lib/types";

const ALL = "ALL";

export interface ContractFiltersState {
  status: ContractStatus | undefined;
  search: string;
  includeArchived: boolean;
}

/** Status dropdown, search, and an "include archived" toggle. */
export function ContractFilters({
  state,
  onChange,
}: {
  state: ContractFiltersState;
  onChange: (patch: Partial<ContractFiltersState>) => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
      <div className="relative lg:max-w-xs lg:flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={state.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder={fr.contracts.searchPlaceholder}
          aria-label={fr.contracts.searchPlaceholder}
          className="pl-9"
        />
      </div>

      <Select
        value={state.status ?? ALL}
        onValueChange={(v) =>
          onChange({ status: v === ALL ? undefined : (v as ContractStatus) })
        }
      >
        <SelectTrigger className="lg:w-56" aria-label={fr.contracts.status}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{fr.contracts.allStatuses}</SelectItem>
          {CONTRACT_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {fr.status.contract[s]}
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
        {fr.contracts.includeArchived}
      </label>
    </div>
  );
}
