"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fr } from "@/lib/i18n/fr";
import type { CandidateStatus } from "@/lib/types";
import { allowedTransitions, type NextStatus } from "@/features/recruitment/pipeline";
import { useTransitionStatus } from "@/features/recruitment/use-recruitment";

/**
 * Pipeline status control. Assumes the caller has already gated to RH. Offers
 * only the transitions the backend state machine allows for the current status;
 * terminal statuses (REJECTED/HIRED) show a muted note instead.
 */
export function StatusTransition({
  candidateId,
  status,
}: {
  candidateId: string;
  status: CandidateStatus;
}) {
  const allowed = allowedTransitions(status);
  const [target, setTarget] = useState<NextStatus | "">("");
  const [comment, setComment] = useState("");
  const mutation = useTransitionStatus(candidateId);

  if (allowed.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {fr.candidates.noTransitionsAvailable}
      </p>
    );
  }

  async function onSubmit() {
    if (!target) return;
    try {
      await mutation.mutateAsync({
        status: target,
        comment: comment.trim() || undefined,
      });
      toast.success(fr.candidates.transitionSuccess);
      setTarget("");
      setComment("");
    } catch {
      toast.error(fr.candidates.transitionError);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">{fr.candidates.transitionStatus}</h3>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5 sm:w-56">
          <Label htmlFor="transition-target">
            {fr.candidates.transitionTarget}
          </Label>
          <Select
            value={target}
            onValueChange={(v) => setTarget(v as NextStatus)}
          >
            <SelectTrigger id="transition-target">
              <SelectValue placeholder={fr.candidates.transitionPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {allowed.map((s) => (
                <SelectItem key={s} value={s}>
                  {fr.status.candidate[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onSubmit}
          disabled={!target || mutation.isPending}
          className="sm:mb-0.5"
        >
          {fr.candidates.transitionSubmit}
        </Button>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="transition-comment">
          {fr.candidates.transitionComment}
        </Label>
        <Textarea
          id="transition-comment"
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
    </div>
  );
}
