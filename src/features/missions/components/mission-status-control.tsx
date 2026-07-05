"use client";

import { ArrowRightLeft } from "lucide-react";
import { SectionCard } from "@/components/common/section-card";
import { Info } from "lucide-react";
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
import type { MissionStatus } from "@/lib/types";
import { missionErrorMessage } from "@/features/missions/form-helpers";
import {
  allowedMissionTransitions,
  type NextMissionStatus,
} from "@/features/missions/missions.status";
import { useChangeMissionStatus } from "@/features/missions/use-missions";

/**
 * Manual mission status change (MANAGER/DIRECTION — parent-gated). Offers only
 * the transitions the backend allows (no DRAFT→IN_PROGRESS shortcut; ARCHIVED is
 * the dedicated archive action). Terminal statuses show a muted note.
 */
export function MissionStatusControl({
  missionId,
  status,
}: {
  missionId: string;
  status: MissionStatus;
}) {
  const allowed = allowedMissionTransitions(status);
  const [target, setTarget] = useState<NextMissionStatus | "">("");
  const [comment, setComment] = useState("");
  const mutation = useChangeMissionStatus(missionId);

  if (allowed.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {fr.missions.noTransitionsAvailable}
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
      toast.success(fr.missions.transitionSuccess);
      setTarget("");
      setComment("");
    } catch (err) {
      toast.error(missionErrorMessage(err));
    }
  }

  return (
    <SectionCard title={fr.missions.transitionStatus} icon={ArrowRightLeft} accent="missions">
      <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5 sm:w-56">
          <Label htmlFor="mission-status-target">
            {fr.missions.transitionTarget}
          </Label>
          <Select
            value={target}
            onValueChange={(v) => setTarget(v as NextMissionStatus)}
          >
            <SelectTrigger id="mission-status-target">
              <SelectValue placeholder={fr.missions.transitionPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {allowed.map((s) => (
                <SelectItem key={s} value={s}>
                  {fr.status.mission[s]}
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
          {fr.missions.transitionSubmit}
        </Button>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="mission-status-comment">
          {fr.missions.transitionComment}
        </Label>
        <Textarea
          id="mission-status-comment"
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {fr.missions.transitionHint}
      </p>
      </div>
    </SectionCard>
  );
}
