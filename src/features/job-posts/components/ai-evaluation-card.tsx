"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  FileX2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/common/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { cn } from "@/lib/utils";
import type { AiEvaluation, AiVerdict } from "@/features/job-posts/ai-evaluation.types";
import {
  useAiEvaluations,
  useAiStatus,
  useTriggerAiEvaluation,
} from "@/features/job-posts/use-ai-evaluation";

const t = fr.aiEvaluation;

/** Score bands drive both the ring color and the verdict chip tone. */
function scoreTone(score: number): { text: string; badge: string } {
  if (score >= 75) return { text: "text-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" };
  if (score >= 50) return { text: "text-amber-500", badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
  return { text: "text-rose-500", badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400" };
}

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === "AI_NOT_CONFIGURED") return t.notConfigured;
    if (err.code === "AI_PROVIDER_ERROR") return t.providerError;
  }
  return t.genericError;
}

export function AiEvaluationCard({ appId, canTrigger }: { appId: string; canTrigger: boolean }) {
  const status = useAiStatus();
  const evaluations = useAiEvaluations(appId);
  const trigger = useTriggerAiEvaluation(appId);

  const configured = status.data?.configured ?? false;
  const rows = evaluations.data ?? [];
  const latest = rows[0];

  function run() {
    trigger.mutate(undefined, {
      onSuccess: () => toast.success(t.success),
      onError: (err) => toast.error(errorMessage(err)),
    });
  }

  const action = canTrigger ? (
    <Button size="sm" onClick={run} disabled={!configured || trigger.isPending || status.isLoading}>
      {trigger.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t.evaluating}
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          {latest ? t.retrigger : t.trigger}
        </>
      )}
    </Button>
  ) : undefined;

  return (
    <SectionCard title={t.title} icon={Sparkles} accent="candidates" action={action}>
      {canTrigger && status.isSuccess && !configured ? (
        <p className="mb-3 text-xs text-muted-foreground">{t.notConfigured}</p>
      ) : null}

      {evaluations.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      ) : latest ? (
        <div className="space-y-5">
          <LatestEvaluation evaluation={latest} />
          {rows.length > 1 ? <History rows={rows.slice(1)} /> : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t.noEvaluations}</p>
      )}
    </SectionCard>
  );
}

function LatestEvaluation({ evaluation }: { evaluation: AiEvaluation }) {
  const tone = scoreTone(evaluation.score);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <ScoreRing score={evaluation.score} className={tone.text} />
        <div className="space-y-1.5">
          <VerdictChip verdict={evaluation.verdict} badgeClass={tone.badge} />
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {evaluation.cvUsed ? (
              <>
                <FileCheck2 className="h-3.5 w-3.5" /> {t.withCv}
              </>
            ) : (
              <>
                <FileX2 className="h-3.5 w-3.5" /> {t.noCv}
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(evaluation.createdAt)} · {t.evaluatedBy}{" "}
            {evaluation.createdBy.firstName} {evaluation.createdBy.lastName}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">{t.strengths}</h4>
          <ul className="space-y-1">
            {evaluation.strengths.map((s) => (
              <li key={s} className="flex items-start gap-1.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">{t.gaps}</h4>
          {evaluation.gaps.length > 0 ? (
            <ul className="space-y-1">
              {evaluation.gaps.map((g) => (
                <li key={g} className="flex items-start gap-1.5 text-sm">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  {g}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{t.noGaps}</p>
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-1 text-xs font-medium text-muted-foreground">{t.reasoning}</h4>
        <p className="text-sm text-muted-foreground">{evaluation.reasoning}</p>
      </div>
    </div>
  );
}

function ScoreRing({ score, className }: { score: number; className?: string }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const filled = (Math.min(Math.max(score, 0), 100) / 100) * circumference;
  return (
    <div className={cn("relative h-16 w-16 shrink-0", className)} role="img" aria-label={`${t.score} : ${score}/100`}>
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="6" className="stroke-muted" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-base font-semibold text-foreground">
        {score}
      </span>
    </div>
  );
}

function VerdictChip({ verdict, badgeClass }: { verdict: AiVerdict; badgeClass: string }) {
  return <Badge className={cn("border-transparent", badgeClass)}>{t.verdicts[verdict]}</Badge>;
}

function History({ rows }: { rows: AiEvaluation[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        {t.history} ({rows.length})
      </button>
      {open ? (
        <ul className="mt-2 space-y-1.5">
          {rows.map((row) => {
            const tone = scoreTone(row.score);
            return (
              <li key={row.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs">
                <span className={cn("font-semibold", tone.text)}>{row.score}/100</span>
                <VerdictChip verdict={row.verdict} badgeClass={tone.badge} />
                <span className="text-muted-foreground">
                  {formatDate(row.createdAt)} · {t.evaluatedBy} {row.createdBy.firstName}{" "}
                  {row.createdBy.lastName}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
