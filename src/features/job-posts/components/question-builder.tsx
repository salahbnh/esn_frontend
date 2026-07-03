"use client";

import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/common/async-states";
import { fr } from "@/lib/i18n/fr";
import { jobPostErrorMessage } from "@/features/job-posts/form-helpers";
import { QueryBoundary } from "@/features/job-posts/query-boundary";
import {
  useAddQuestion,
  useArchiveQuestion,
  useQuestions,
  useReorderQuestions,
  useUpdateQuestion,
} from "@/features/job-posts/use-job-posts";
import type {
  CreateQuestionBody,
  JobQuestion,
  QuestionType,
} from "@/features/job-posts/job-posts.types";

const TYPES: QuestionType[] = [
  "SHORT_TEXT",
  "LONG_TEXT",
  "SINGLE_CHOICE",
  "MULTI_CHOICE",
  "BOOLEAN",
  "NUMBER",
];
const CHOICE = new Set<QuestionType>(["SINGLE_CHOICE", "MULTI_CHOICE"]);

export function QuestionBuilder({ jobPostId }: { jobPostId: string }) {
  const query = useQuestions(jobPostId);
  const reorder = useReorderQuestions(jobPostId);
  const archive = useArchiveQuestion(jobPostId);
  const [editing, setEditing] = useState<JobQuestion | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{fr.jobPosts.questionsHint}</p>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          {fr.jobPosts.addQuestion}
        </Button>
      </div>

      <QueryBoundary query={query}>
        {(questions) =>
          questions.length === 0 ? (
            <EmptyState title={fr.jobPosts.noQuestions} />
          ) : (
            <ul className="space-y-2">
              {questions.map((q, i) => (
                <li key={q.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex-1">
                    <p className="font-medium">
                      {q.label}
                      {q.required ? <span className="text-destructive"> *</span> : null}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <code>{q.key}</code>
                      <span>·</span>
                      <Badge variant="outline">{fr.jobPosts.questionTypes[q.type]}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={i === 0 || reorder.isPending}
                    onClick={() =>
                      reorder.mutate(swap(questions.map((x) => x.id), i, i - 1))
                    }
                    aria-label={fr.jobPosts.moveUp}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={i === questions.length - 1 || reorder.isPending}
                    onClick={() =>
                      reorder.mutate(swap(questions.map((x) => x.id), i, i + 1))
                    }
                    aria-label={fr.jobPosts.moveDown}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(q)}
                    aria-label={fr.jobPosts.editQuestion}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={fr.jobPosts.questionRemoved}
                    onClick={() => {
                      archive.mutate(q.id, {
                        onSuccess: () => toast.success(fr.jobPosts.questionRemoved),
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )
        }
      </QueryBoundary>

      {creating ? (
        <QuestionEditor jobPostId={jobPostId} onClose={() => setCreating(false)} />
      ) : null}
      {editing ? (
        <QuestionEditor jobPostId={jobPostId} question={editing} onClose={() => setEditing(null)} />
      ) : null}
    </div>
  );
}

function swap(ids: string[], a: number, b: number): string[] {
  const next = [...ids];
  [next[a], next[b]] = [next[b]!, next[a]!];
  return next;
}

function QuestionEditor({
  jobPostId,
  question,
  onClose,
}: {
  jobPostId: string;
  question?: JobQuestion;
  onClose: () => void;
}) {
  const isEdit = Boolean(question);
  const add = useAddQuestion(jobPostId);
  const update = useUpdateQuestion(jobPostId);
  const [key, setKey] = useState(question?.key ?? "");
  const [label, setLabel] = useState(question?.label ?? "");
  const [type, setType] = useState<QuestionType>(question?.type ?? "SHORT_TEXT");
  const [required, setRequired] = useState(question?.required ?? false);
  const [optionsText, setOptionsText] = useState((question?.options ?? []).join("\n"));
  const [helpText, setHelpText] = useState(question?.helpText ?? "");

  const options = optionsText
    .split("\n")
    .map((o) => o.trim())
    .filter(Boolean);

  async function onSave() {
    const optionPart = CHOICE.has(type) ? { options } : {};
    try {
      if (isEdit) {
        await update.mutateAsync({
          qid: question!.id,
          body: { label: label.trim(), required, helpText: helpText.trim() || undefined, ...optionPart },
        });
      } else {
        const body: CreateQuestionBody = {
          key: key.trim(),
          label: label.trim(),
          type,
          required,
          ...(helpText.trim() ? { helpText: helpText.trim() } : {}),
          ...optionPart,
        };
        await add.mutateAsync(body);
      }
      toast.success(fr.jobPosts.questionSaved);
      onClose();
    } catch (err) {
      toast.error(jobPostErrorMessage(err));
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? fr.jobPosts.editQuestion : fr.jobPosts.addQuestion}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {!isEdit ? (
            <div className="space-y-1.5">
              <Label htmlFor="q-key">{fr.jobPosts.qKey} *</Label>
              <Input
                id="q-key"
                value={key}
                onChange={(e) => setKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
                placeholder="years_experience"
              />
            </div>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor="q-label">{fr.jobPosts.qLabel} *</Label>
            <Input id="q-label" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          {!isEdit ? (
            <div className="space-y-1.5">
              <Label>{fr.jobPosts.qType}</Label>
              <Select value={type} onValueChange={(v) => setType(v as QuestionType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{fr.jobPosts.questionTypes[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          {CHOICE.has(type) ? (
            <div className="space-y-1.5">
              <Label htmlFor="q-options">{fr.jobPosts.qOptions}</Label>
              <Textarea id="q-options" rows={4} value={optionsText} onChange={(e) => setOptionsText(e.target.value)} />
            </div>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor="q-help">{fr.jobPosts.qHelpText}</Label>
            <Input id="q-help" value={helpText} onChange={(e) => setHelpText(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            {fr.jobPosts.qRequired}
          </label>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>{fr.jobPosts.cancel}</Button>
          <Button
            onClick={onSave}
            disabled={add.isPending || update.isPending || !label.trim() || (!isEdit && !key.trim())}
          >
            {fr.jobPosts.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
