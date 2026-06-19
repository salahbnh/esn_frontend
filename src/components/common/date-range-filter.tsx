"use client";

/**
 * From/to date-window control. Defaults to the last 90 days. Uses a popover
 * with two native date inputs; emits `{ from, to }` as ISO date strings
 * (`YYYY-MM-DD`) only when "Appliquer" is pressed, so charts don't refetch on
 * every keystroke. The trigger shows the active window (fr-FR).
 */

import { CalendarDays } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import type { DateWindow } from "@/features/reporting/reporting.types";

/** ISO `YYYY-MM-DD` for a date offset by `days` from today. */
function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function defaultDateWindow(): DateWindow {
  return { from: isoDaysAgo(90), to: isoDaysAgo(0) };
}

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateWindow;
  onChange: (next: DateWindow) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateWindow>(value);

  function apply() {
    onChange(draft);
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(value);
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          <span className="tabular-nums">
            {formatDate(value.from)} – {formatDate(value.to)}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="date-from">{fr.dateRange.from}</Label>
          <Input
            id="date-from"
            type="date"
            value={draft.from}
            max={draft.to}
            onChange={(e) =>
              setDraft((d) => ({ ...d, from: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="date-to">{fr.dateRange.to}</Label>
          <Input
            id="date-to"
            type="date"
            value={draft.to}
            min={draft.from}
            onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
          />
        </div>
        <Button
          size="sm"
          className="w-full"
          onClick={apply}
          disabled={!draft.from || !draft.to || draft.from > draft.to}
        >
          {fr.dateRange.apply}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
