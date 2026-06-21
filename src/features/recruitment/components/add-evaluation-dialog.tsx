"use client";

import { Plus, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fr } from "@/lib/i18n/fr";
import { useAddEvaluation } from "@/features/recruitment/use-recruitment";

interface CriterionRow {
  name: string;
  score: number;
}

function defaultRows(): CriterionRow[] {
  return [
    { name: "Technique", score: 5 },
    { name: "Communication", score: 5 },
    { name: "Motivation", score: 5 },
  ];
}

/** Clamp to an integer in [0, 10] (the backend's allowed range). */
function clampScore(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(10, Math.round(n)));
}

/** Add an evaluation (RH/MANAGER/DIRECTION). Dynamic per-criterion scores. */
export function AddEvaluationDialog({ candidateId }: { candidateId: string }) {
  const [open, setOpen] = useState(false);
  const [overallScore, setOverallScore] = useState(5);
  const [rows, setRows] = useState<CriterionRow[]>(defaultRows());
  const [recommendation, setRecommendation] = useState("");
  const [comment, setComment] = useState("");
  const mutation = useAddEvaluation(candidateId);

  function resetForm() {
    setOverallScore(5);
    setRows(defaultRows());
    setRecommendation("");
    setComment("");
  }

  function onOpenChange(next: boolean) {
    if (next) resetForm();
    setOpen(next);
  }

  function updateRow(index: number, patch: Partial<CriterionRow>) {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const criteria: Record<string, number> = {};
    for (const row of rows) {
      const name = row.name.trim();
      if (name) criteria[name] = clampScore(row.score);
    }
    try {
      await mutation.mutateAsync({
        criteria,
        overallScore: clampScore(overallScore),
        recommendation: recommendation.trim() || undefined,
        comment: comment.trim() || undefined,
      });
      toast.success(fr.candidates.evaluationSuccess);
      resetForm();
      setOpen(false);
    } catch {
      toast.error(fr.candidates.addError);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Star className="h-4 w-4" />
          {fr.candidates.add}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.candidates.addEvaluation}</DialogTitle>
          <DialogDescription>{fr.candidates.tabEvaluations}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="overall-score">
              {fr.candidates.overallScore} (0–10)
            </Label>
            <Input
              id="overall-score"
              type="number"
              min={0}
              max={10}
              value={overallScore}
              onChange={(e) => setOverallScore(Number(e.target.value))}
              className="w-24"
            />
          </div>

          <div className="space-y-2">
            <Label>{fr.candidates.criteria}</Label>
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  aria-label={fr.candidates.criterionName}
                  placeholder={fr.candidates.criterionName}
                  value={row.name}
                  onChange={(e) => updateRow(i, { name: e.target.value })}
                  className="flex-1"
                />
                <Input
                  aria-label={fr.candidates.score}
                  type="number"
                  min={0}
                  max={10}
                  value={row.score}
                  onChange={(e) =>
                    updateRow(i, { score: Number(e.target.value) })
                  }
                  className="w-20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Supprimer ${row.name || fr.candidates.criterionName}`}
                  onClick={() =>
                    setRows((prev) => prev.filter((_, idx) => idx !== i))
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setRows((prev) => [...prev, { name: "", score: 5 }])
              }
            >
              <Plus className="h-4 w-4" />
              {fr.candidates.addCriterion}
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="recommendation">
              {fr.candidates.recommendation}
            </Label>
            <Input
              id="recommendation"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="eval-comment">{fr.candidates.comment}</Label>
            <Textarea
              id="eval-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {fr.candidates.cancel}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {fr.candidates.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
