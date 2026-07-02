"use client";

import { fr } from "@/lib/i18n/fr";
import { formatDate } from "@/lib/format";
import { signingSubState } from "@/features/contracts/contracts.workflow";
import type { Contract } from "@/features/contracts/contracts.types";

/**
 * Read-only signing state for the contract detail (RH/MGR/DIR view): which side
 * the signature is waiting on, who signed/countersigned when, and — after a
 * consultant rejection — the reason (visible once the contract is back in DRAFT).
 */
export function SigningStatus({ contract }: { contract: Contract }) {
  const sub = signingSubState(contract);
  const hasReject = contract.status === "DRAFT" && contract.rejectionReason !== null;

  if (!sub && !contract.consultantSignedAt && !contract.companySignedAt && !hasReject) {
    return null;
  }

  return (
    <div className="space-y-2 rounded-lg border p-4">
      {hasReject ? (
        <p className="text-sm font-medium text-destructive">
          {fr.contracts.rejectedBanner} — {contract.rejectionReason}
        </p>
      ) : null}

      {sub === "AWAITING_CONSULTANT" ? (
        <p className="text-sm text-muted-foreground">{fr.contracts.awaitingConsultant}</p>
      ) : null}
      {sub === "AWAITING_COMPANY" ? (
        <p className="text-sm text-muted-foreground">{fr.contracts.awaitingCompany}</p>
      ) : null}

      {contract.consultantSignedAt ? (
        <p className="text-sm">
          {fr.contracts.signedByConsultant}: {contract.consultantSignatoryName} —{" "}
          {formatDate(contract.consultantSignedAt)}
        </p>
      ) : null}
      {contract.companySignedAt ? (
        <p className="text-sm">
          {fr.contracts.countersignedByCompany} {contract.companySignatoryName} —{" "}
          {formatDate(contract.companySignedAt)}
        </p>
      ) : null}
    </div>
  );
}
