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
import { CANDIDATE_STATUSES, type CandidateStatus } from "@/lib/types";

const ALL = "ALL";

/** Status dropdown + free-text search. Controlled by the list view. */
export function CandidateFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: {
  status: CandidateStatus | undefined;
  search: string;
  onStatusChange: (status: CandidateStatus | undefined) => void;
  onSearchChange: (search: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative sm:max-w-xs sm:flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={fr.candidates.searchPlaceholder}
          aria-label={fr.candidates.searchPlaceholder}
          className="pl-9"
        />
      </div>
      <Select
        value={status ?? ALL}
        onValueChange={(v) =>
          onStatusChange(v === ALL ? undefined : (v as CandidateStatus))
        }
      >
        <SelectTrigger className="sm:w-52" aria-label={fr.candidates.status}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{fr.candidates.allStatuses}</SelectItem>
          {CANDIDATE_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {fr.status.candidate[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
