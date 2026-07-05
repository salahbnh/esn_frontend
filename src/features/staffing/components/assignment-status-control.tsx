"use client";

import { ArrowRightLeft } from "lucide-react";
import { SectionCard } from "@/components/common/section-card";
import { Info } from "lucide-react";
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
} from "@/components/ui/dialog";
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
import type { AssignmentStatus } from "@/lib/types";
import {
  assignmentErrorMessage,
  isOverAllocated,
} from "@/features/staffing/form-helpers";
import { allowedAssignmentTransitions } from "@/features/staffing/staffing.status";
import { useChangeAssignmentStatus } from "@/features/staffing/use-staffing";

/**
 * Manual assignment status change (MANAGER/DIRECTION — parent-gated). Offers only
 * the allowed transitions. Activating (→ ACTIVE) past 100% allocation is rejected
 * with OVER_ALLOCATED → a force confirm retries with `force: true`.
 */
export function AssignmentStatusControl({
  assignmentId,
  status,
}: {
  assignmentId: string;
  status: AssignmentStatus;
}) {
  const allowed = allowedAssignmentTransitions(status);
  const [target, setTarget] = useState<AssignmentStatus | "">("");
  const [comment, setComment] = useState("");
  const [showForce, setShowForce] = useState(false);
  const mutation = useChangeAssignmentStatus(assignmentId);

  if (allowed.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {fr.staffing.noTransitionsAvailable}
      </p>
    );
  }

  async function doSubmit(force: boolean) {
    if (!target) return;
    try {
      await mutation.mutateAsync({
        status: target,
        comment: comment.trim() || undefined,
        ...(force ? { force: true } : {}),
      });
      toast.success(fr.staffing.transitionSuccess);
      setTarget("");
      setComment("");
      setShowForce(false);
    } catch (err) {
      if (isOverAllocated(err)) {
        setShowForce(true);
        return;
      }
      toast.error(assignmentErrorMessage(err));
    }
  }

  return (
    <SectionCard title={fr.staffing.transitionStatus} icon={ArrowRightLeft} accent="staffing">
      <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5 sm:w-56">
          <Label htmlFor="assignment-status-target">
            {fr.staffing.transitionTarget}
          </Label>
          <Select
            value={target}
            onValueChange={(v) => setTarget(v as AssignmentStatus)}
          >
            <SelectTrigger id="assignment-status-target">
              <SelectValue placeholder={fr.staffing.transitionPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {allowed.map((s) => (
                <SelectItem key={s} value={s}>
                  {fr.status.assignment[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => doSubmit(false)}
          disabled={!target || mutation.isPending}
          className="sm:mb-0.5"
        >
          {fr.staffing.transitionSubmit}
        </Button>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="assignment-status-comment">
          {fr.staffing.transitionComment}
        </Label>
        <Textarea
          id="assignment-status-comment"
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {fr.staffing.transitionHint}
      </p>

      <Dialog open={showForce} onOpenChange={(o) => !o && setShowForce(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{fr.staffing.forceTitle}</DialogTitle>
            <DialogDescription>{fr.staffing.forceConfirm}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForce(false)}
            >
              {fr.staffing.cancel}
            </Button>
            <Button
              type="button"
              disabled={mutation.isPending}
              onClick={() => doSubmit(true)}
            >
              {fr.staffing.force}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </SectionCard>
  );
}
