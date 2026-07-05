"use client";

import { Check, Clock, MessageSquareText, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { CONTRACT_VALIDATION_STEPS } from "@/lib/types";
import { currentPendingStep } from "@/features/contracts/contracts.workflow";
import type { ContractValidation } from "@/features/contracts/contracts.types";

/**
 * The RH → Manager → Direction validation circuit as a vertical timeline: a
 * connector rail with one node per step (✓ approved, ✕ rejected, pulsing clock
 * for the step awaiting a decision, hollow for future steps), the decision date
 * and any comment inline. Read-only — actions live in ValidateControl.
 */
export function ValidationTimeline({
  validations,
  managerName,
}: {
  validations: ContractValidation[];
  /** Designated MANAGER-step approver (real-ESN routing); null = any manager. */
  managerName?: string | null;
}) {
  const pending = currentPendingStep(validations);
  const byStep = new Map(validations.map((v) => [v.step, v]));
  const hasCircuit = validations.length > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">{fr.contracts.validationTitle}</h3>

      {!hasCircuit ? (
        <p className="text-sm text-muted-foreground">
          {fr.contracts.validationNotStarted}
        </p>
      ) : (
        <ol className="relative space-y-0">
          {CONTRACT_VALIDATION_STEPS.map((step, i) => {
            const v = byStep.get(step);
            const isCurrent = pending === step;
            const isLast = i === CONTRACT_VALIDATION_STEPS.length - 1;
            const state = v?.state;

            return (
              <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Connector rail */}
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px",
                      state === "APPROVED" ? "bg-success/50" : "bg-border",
                    )}
                  />
                ) : null}

                {/* Node */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                    state === "APPROVED" &&
                      "border-success bg-success text-white",
                    state === "REJECTED" &&
                      "border-destructive bg-destructive text-white",
                    state === "PENDING" &&
                      isCurrent &&
                      "border-role-rh bg-role-rh/15 text-role-rh",
                    ((state === "PENDING" && !isCurrent) || !state) &&
                      "border-dashed border-muted-foreground/40 bg-background text-muted-foreground/50",
                  )}
                >
                  {state === "APPROVED" ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : state === "REJECTED" ? (
                    <X className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <Clock
                      className={cn("h-4 w-4", isCurrent && "animate-pulse")}
                    />
                  )}
                </span>

                {/* Content */}
                <div
                  className={cn(
                    "min-w-0 flex-1 rounded-lg border px-4 py-3 transition-colors",
                    isCurrent
                      ? "border-role-rh/40 bg-role-rh/5"
                      : "border-transparent bg-muted/40",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      {fr.contracts.validationSteps[step]}
                      {step === "MANAGER" && managerName ? (
                        <span className="ml-1.5 font-normal text-muted-foreground">
                          — {managerName}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        state === "APPROVED" && "text-success",
                        state === "REJECTED" && "text-destructive",
                        state === "PENDING" && isCurrent && "text-role-rh",
                        (!state || (state === "PENDING" && !isCurrent)) &&
                          "text-muted-foreground",
                      )}
                    >
                      {state ? fr.contracts.validationStates[state] : "—"}
                    </span>
                  </div>
                  {v?.decidedAt ? (
                    <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                      {formatDate(v.decidedAt)}
                    </p>
                  ) : null}
                  {v?.comment ? (
                    <p className="mt-2 flex items-start gap-1.5 whitespace-pre-wrap rounded-md bg-background/60 px-2.5 py-1.5 text-sm text-muted-foreground">
                      <MessageSquareText
                        aria-hidden="true"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                      />
                      {v.comment}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
