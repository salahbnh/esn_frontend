"use client";

import { Check, CircleDashed, UserCheck, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { fr } from "@/lib/i18n/fr";
import type { CandidateStatus } from "@/lib/types";

/** The nominal pipeline path; REJECTED is a side exit rendered as a banner. */
const PIPELINE: readonly CandidateStatus[] = [
  "APPLIED",
  "INTERVIEW",
  "VALIDATED",
  "HIRED",
];

/**
 * Horizontal recruitment-pipeline stepper: one node per stage with connector
 * segments, filled up to the candidate's current stage. A rejected candidate
 * shows a terminal banner instead of a highlighted stage. Read-only — the
 * transition action lives in StatusTransition.
 */
export function PipelineStepper({ status }: { status: CandidateStatus }) {
  const rejected = status === "REJECTED";
  const currentIndex = rejected ? -1 : PIPELINE.indexOf(status);
  const hired = status === "HIRED";

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <ol className="flex items-start">
        {PIPELINE.map((step, i) => {
          const done = !rejected && i < currentIndex;
          const current = !rejected && i === currentIndex;
          const isLast = i === PIPELINE.length - 1;
          return (
            <li key={step} className={cn("flex items-start", !isLast && "flex-1")}>
              <div className="flex min-w-0 flex-col items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    (done || (current && hired)) &&
                      "border-success bg-success text-white",
                    current && !hired &&
                      "border-violet-500 bg-violet-500/15 text-violet-600 dark:border-violet-400 dark:text-violet-300",
                    !done && !current &&
                      "border-dashed border-muted-foreground/40 text-muted-foreground/50",
                  )}
                >
                  {done || (current && hired) ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : current ? (
                    <UserCheck className="h-4 w-4" />
                  ) : (
                    <CircleDashed className="h-4 w-4" />
                  )}
                </span>
                <span
                  className={cn(
                    "px-1 text-center text-xs font-medium leading-tight",
                    current
                      ? "text-foreground"
                      : done
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60",
                  )}
                >
                  {fr.status.candidate[step]}
                </span>
              </div>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-2 mt-4 h-0.5 flex-1 rounded-full",
                    done ? "bg-success/60" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      {rejected ? (
        <p className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <XCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
          {fr.candidates.pipelineRejected}
        </p>
      ) : null}
    </div>
  );
}
