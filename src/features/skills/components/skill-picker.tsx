"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fr } from "@/lib/i18n/fr";
import type { Skill } from "@/lib/types";
import { useSkills } from "@/features/skills/use-skills";

interface SkillPickerProps {
  value: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Reusable multiselect over the skills referential (`GET /api/skills`). Fetches
 * all skills once (cached), filters client-side, groups by category. Emits the
 * selected skill ids via onChange. Read is allowed for every role.
 */
export function SkillPicker({ value, onChange, disabled, placeholder }: SkillPickerProps) {
  const { data, isLoading } = useSkills({ pageSize: 200 });
  const [search, setSearch] = useState("");

  const skills = useMemo(() => data?.data ?? [], [data]);
  const selected = useMemo(
    () => skills.filter((s) => value.includes(s.id)),
    [skills, value],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q ? skills.filter((s) => s.name.toLowerCase().includes(q)) : skills;
    // Group by category (null → "Autres"), alphabetical within group.
    const groups = new Map<string, Skill[]>();
    for (const s of list) {
      const key = s.category ?? fr.skills.uncategorized;
      const arr = groups.get(key) ?? [];
      arr.push(s);
      groups.set(key, arr);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [skills, search]);

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  }

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="w-full justify-between font-normal"
          >
            {value.length > 0
              ? `${value.length} ${fr.skills.pickerSelected}`
              : (placeholder ?? fr.skills.pickerPlaceholder)}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <div className="border-b p-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={fr.skills.searchPlaceholder}
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            {isLoading ? (
              <p className="p-3 text-sm text-muted-foreground">{fr.common.loading}</p>
            ) : filtered.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">{fr.skills.noResults}</p>
            ) : (
              filtered.map(([category, items]) => (
                <div key={category} className="mb-1">
                  <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {category}
                  </p>
                  {items.map((s) => {
                    const isSel = value.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggle(s.id)}
                        className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent"
                      >
                        <span>{s.name}</span>
                        {isSel ? <Check className="h-4 w-4 text-primary" /> : null}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((s) => (
            <Badge key={s.id} variant="secondary" className="gap-1">
              {s.name}
              {!disabled ? (
                <button
                  type="button"
                  onClick={() => toggle(s.id)}
                  aria-label={`${fr.common.remove} ${s.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              ) : null}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
