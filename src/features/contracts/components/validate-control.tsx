"use client";

import { Check, Stamp, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fr } from "@/lib/i18n/fr";
import { contractErrorMessage } from "@/features/contracts/form-helpers";
import { canValidate } from "@/features/contracts/contracts.workflow";
import { useValidateContract } from "@/features/contracts/use-contracts";
import type { ContractDetail } from "@/features/contracts/contracts.types";

/**
 * Approve / reject the current validation step. Only rendered for the role that
 * owns the pending step (RH → MANAGER → DIRECTION) while the contract is under
 * internal validation. Approve advances the circuit; reject clears it back to
 * DRAFT (the comment explains why).
 */
export function ValidateControl({ contract }: { contract: ContractDetail }) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? null;
  const [comment, setComment] = useState("");
  const mutation = useValidateContract(contract.id);

  if (!canValidate(contract.validations, contract.status, role)) return null;

  async function decide(decision: "APPROVED" | "REJECTED") {
    try {
      await mutation.mutateAsync({
        decision,
        comment: comment.trim() || undefined,
      });
      toast.success(fr.contracts.validateSuccess);
      setComment("");
    } catch (err) {
      toast.error(contractErrorMessage(err));
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary"
        >
          <Stamp className="h-4 w-4" />
        </span>
        {fr.contracts.yourDecision}
      </h3>
      <div className="space-y-1.5">
        <Label htmlFor="validate-comment">{fr.contracts.validateComment}</Label>
        <Textarea
          id="validate-comment"
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => decide("REJECTED")}
          disabled={mutation.isPending}
        >
          <X className="h-4 w-4" />
          {fr.contracts.reject}
        </Button>
        <Button onClick={() => decide("APPROVED")} disabled={mutation.isPending}>
          <Check className="h-4 w-4" />
          {fr.contracts.approve}
        </Button>
      </div>
    </div>
  );
}
