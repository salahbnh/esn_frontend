"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { CONTRACT_VALIDATION_STEPS } from "@/lib/types";
import { currentPendingStep } from "@/features/contracts/contracts.workflow";
import type { ContractValidation } from "@/features/contracts/contracts.types";
import type { ContractValidationState } from "@/lib/types";

const STATE_TONE: Record<ContractValidationState, string> = {
  PENDING: "bg-role-rh/15 text-role-rh border-transparent dark:bg-role-rh/25",
  APPROVED: "bg-success/15 text-success border-transparent dark:bg-success/25",
  REJECTED:
    "bg-destructive/15 text-destructive border-transparent dark:bg-destructive/25",
};

/**
 * Read-only RH → Manager → Direction validation circuit. Each step shows its
 * decision state, who-decided date, and any comment. The step currently
 * awaiting a decision is highlighted.
 */
export function ValidationTimeline({
  validations,
}: {
  validations: ContractValidation[];
}) {
  const pending = currentPendingStep(validations);
  const byStep = new Map(validations.map((v) => [v.step, v]));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{fr.contracts.validationTitle}</h3>
      <ol className="space-y-3">
        {CONTRACT_VALIDATION_STEPS.map((step) => {
          const v = byStep.get(step);
          const isCurrent = pending === step;
          return (
            <li
              key={step}
              className={cn(
                "rounded-lg border p-4",
                isCurrent && "border-primary/40 bg-primary/5",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">
                  {fr.contracts.validationSteps[step]}
                </span>
                {v ? (
                  <Badge className={STATE_TONE[v.state]}>
                    {fr.contracts.validationStates[v.state]}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
              {v && v.decidedAt ? (
                <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                  {formatDate(v.decidedAt)}
                </p>
              ) : null}
              {v && v.comment ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                  {v.comment}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
