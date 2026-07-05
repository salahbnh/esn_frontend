"use client";

import { Building2, CircleAlert, Clock, PenLine } from "lucide-react";

import { fr } from "@/lib/i18n/fr";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { signingSubState } from "@/features/contracts/contracts.workflow";
import type { Contract } from "@/features/contracts/contracts.types";

/**
 * Read-only signing state for the contract detail (RH/MGR/DIR view): the two
 * signature slots (consultant + company) as side-by-side cards showing who
 * signed when — and, after a consultant rejection, a reason banner (visible
 * once the contract is back in DRAFT).
 */
export function SigningStatus({ contract }: { contract: Contract }) {
  const sub = signingSubState(contract);
  const hasReject = contract.status === "DRAFT" && contract.rejectionReason !== null;
  const showSlots =
    sub !== null || contract.consultantSignedAt !== null || contract.companySignedAt !== null;

  if (!showSlots && !hasReject) return null;

  return (
    <div className="space-y-3">
      {hasReject ? (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm">
            <span className="font-medium text-destructive">{fr.contracts.rejectedBanner}</span>
            <span className="text-muted-foreground"> — {contract.rejectionReason}</span>
          </p>
        </div>
      ) : null}

      {showSlots ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SignatureSlot
            icon={PenLine}
            title={fr.contracts.signedByConsultant}
            signedAt={contract.consultantSignedAt}
            name={contract.consultantSignatoryName}
            waitingLabel={fr.contracts.awaitingConsultant}
            waiting={sub === "AWAITING_CONSULTANT"}
          />
          <SignatureSlot
            icon={Building2}
            title={fr.contracts.countersignedByCompany}
            signedAt={contract.companySignedAt}
            name={contract.companySignatoryName}
            waitingLabel={fr.contracts.awaitingCompany}
            waiting={sub === "AWAITING_COMPANY"}
          />
        </div>
      ) : null}
    </div>
  );
}

function SignatureSlot({
  icon: Icon,
  title,
  signedAt,
  name,
  waitingLabel,
  waiting,
}: {
  icon: typeof PenLine;
  title: string;
  signedAt: string | null;
  name: string | null;
  waitingLabel: string;
  waiting: boolean;
}) {
  const signed = signedAt !== null;
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3",
        signed && "border-success/30 bg-success/5",
        !signed && waiting && "border-role-rh/40 bg-role-rh/5",
        !signed && !waiting && "border-dashed",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          signed && "bg-success/15 text-success",
          !signed && waiting && "bg-role-rh/15 text-role-rh",
          !signed && !waiting && "bg-muted text-muted-foreground/60",
        )}
      >
        {signed ? <Icon className="h-4 w-4" /> : <Clock className={cn("h-4 w-4", waiting && "animate-pulse")} />}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        {signed ? (
          <p className="mt-0.5 text-sm">
            <span className="font-medium">{name ?? "—"}</span>
            <span className="tabular-nums text-muted-foreground"> · {formatDate(signedAt)}</span>
          </p>
        ) : (
          <p className="mt-0.5 text-sm text-muted-foreground">{waitingLabel}</p>
        )}
      </div>
    </div>
  );
}
