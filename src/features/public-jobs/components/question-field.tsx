"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PublicQuestion } from "@/features/public-jobs/public-jobs.types";

type AnswerValue = string | number | boolean | string[] | undefined;

export function QuestionField({
  question,
  value,
  onChange,
}: {
  question: PublicQuestion;
  value: AnswerValue;
  onChange: (v: AnswerValue) => void;
}) {
  const id = `q-${question.key}`;
  return (
    <div className="space-y-1.5">
      {question.type !== "BOOLEAN" ? (
        <Label htmlFor={id}>
          {question.label}
          {question.required ? <span className="text-destructive"> *</span> : null}
        </Label>
      ) : null}
      {question.helpText ? <p className="text-xs text-muted-foreground">{question.helpText}</p> : null}
      {renderInput(question, id, value, onChange)}
    </div>
  );
}

function renderInput(
  q: PublicQuestion,
  id: string,
  value: AnswerValue,
  onChange: (v: AnswerValue) => void,
) {
  switch (q.type) {
    case "SHORT_TEXT":
      return <Input id={id} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "LONG_TEXT":
      return <Textarea id={id} rows={4} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "NUMBER":
      return (
        <Input
          id={id}
          type="number"
          value={value === undefined ? "" : String(value)}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        />
      );
    case "BOOLEAN":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-input accent-primary"
          />
          {q.label}
          {q.required ? <span className="text-destructive"> *</span> : null}
        </label>
      );
    case "SINGLE_CHOICE":
      return (
        <div className="space-y-1">
          {(q.options ?? []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={id}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="accent-primary"
              />
              {opt}
            </label>
          ))}
        </div>
      );
    case "MULTI_CHOICE": {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-1">
          {(q.options ?? []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={(e) =>
                  onChange(e.target.checked ? [...selected, opt] : selected.filter((x) => x !== opt))
                }
                className="h-4 w-4 rounded border-input accent-primary"
              />
              {opt}
            </label>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}
