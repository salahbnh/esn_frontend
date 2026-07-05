"use client";

import { ArrowRightLeft, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SectionCard } from "@/components/common/section-card";
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
import type { ConsultantStatus } from "@/lib/types";
import { consultantErrorMessage } from "@/features/consultants/form-helpers";
import { allowedConsultantTransitions } from "@/features/consultants/consultants.status";
import { useChangeConsultantStatus } from "@/features/consultants/use-consultants";

/**
 * Manual consultant status change (RH / MANAGER / DIRECTION — parent-gated).
 * Offers only the reversible transitions the backend allows. Note: status is
 * normally driven automatically by the Staffing module; this is for corrections.
 */
export function ConsultantStatusControl({
  consultantId,
  status,
}: {
  consultantId: string;
  status: ConsultantStatus;
}) {
  const allowed = allowedConsultantTransitions(status);
  const [target, setTarget] = useState<ConsultantStatus | "">("");
  const [comment, setComment] = useState("");
  const mutation = useChangeConsultantStatus(consultantId);

  if (allowed.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {fr.consultants.noTransitionsAvailable}
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
      toast.success(fr.consultants.transitionSuccess);
      setTarget("");
      setComment("");
    } catch (err) {
      toast.error(consultantErrorMessage(err));
    }
  }

  return (
    <SectionCard
      title={fr.consultants.transitionStatus}
      icon={ArrowRightLeft}
      accent="consultants"
    >
      <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5 sm:w-56">
          <Label htmlFor="consultant-status-target">
            {fr.consultants.transitionTarget}
          </Label>
          <Select
            value={target}
            onValueChange={(v) => setTarget(v as ConsultantStatus)}
          >
            <SelectTrigger id="consultant-status-target">
              <SelectValue placeholder={fr.consultants.transitionPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {allowed.map((s) => (
                <SelectItem key={s} value={s}>
                  {fr.status.consultant[s]}
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
          {fr.consultants.transitionSubmit}
        </Button>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="consultant-status-comment">
          {fr.consultants.transitionComment}
        </Label>
        <Textarea
          id="consultant-status-comment"
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {fr.consultants.transitionHint}
      </p>
      </div>
    </SectionCard>
  );
}
