"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fr } from "@/lib/i18n/fr";
import { useSuggestions } from "@/features/staffing/use-staffing";

/**
 * Ranked consultant suggestions for a mission (skill overlap, then lowest current
 * allocation). A helper inside the create dialog — clicking one sets the
 * consultant field. Only AVAILABLE consultants with matching skills are returned.
 */
export function SuggestionList({
  missionId,
  selectedId,
  onSelect,
}: {
  missionId: string;
  selectedId: string;
  onSelect: (consultantId: string) => void;
}) {
  const { data, isPending } = useSuggestions(missionId);

  if (!missionId) return null;
  if (isPending) {
    return (
      <p className="text-xs text-muted-foreground">
        {fr.staffing.suggestionsTitle}…
      </p>
    );
  }
  const items = data?.data ?? [];
  if (items.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">{fr.staffing.noSuggestions}</p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {fr.staffing.suggestionsTitle}
      </p>
      <ul className="space-y-2">
        {items.map((s) => {
          const selected = s.consultant.id === selectedId;
          return (
            <li
              key={s.consultant.id}
              className="flex items-center justify-between gap-3 rounded-md border p-2.5"
            >
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium">
                  {s.consultant.firstName} {s.consultant.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fr.staffing.matchedSkills}: {s.matchCount} ·{" "}
                  {fr.staffing.currentAllocation}: {s.currentAllocationPct} %
                </p>
                {s.matchedSkills.length > 0 ? (
                  <span className="flex flex-wrap gap-1">
                    {s.matchedSkills.map((sk) => (
                      <Badge key={sk.id} variant="secondary">
                        {sk.name}
                      </Badge>
                    ))}
                  </span>
                ) : null}
              </div>
              <Button
                type="button"
                size="sm"
                variant={selected ? "default" : "outline"}
                onClick={() => onSelect(s.consultant.id)}
              >
                {fr.staffing.select}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
