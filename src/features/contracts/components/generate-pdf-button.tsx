"use client";

import { FileDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fr } from "@/lib/i18n/fr";
import { contractErrorMessage } from "@/features/contracts/form-helpers";
import { useGenerateContractPdf } from "@/features/contracts/use-contracts";
import type { ContractDetail } from "@/features/contracts/contracts.types";

/**
 * Generate the contract PDF (RH / DIRECTION). Backend allows it only in
 * INTERNAL_VALIDATION / PENDING_SIGNATURE with a non-empty body and no unfilled
 * placeholders — so the button is disabled (with a hint) when there's nothing to
 * render. Downloading the generated PDF is deferred to M8 (Documents).
 */
export function GeneratePdfButton({ contract }: { contract: ContractDetail }) {
  const mutation = useGenerateContractPdf(contract.id);
  const { renderedBody, unfilled } = contract.prefilledData;
  const canGenerate = renderedBody.trim().length > 0 && unfilled.length === 0;

  async function onClick() {
    try {
      await mutation.mutateAsync();
      toast.success(fr.contracts.generateSuccess);
    } catch (err) {
      toast.error(contractErrorMessage(err));
    }
  }

  if (contract.generatedPdfId) {
    return (
      <span className="text-sm text-success">{fr.contracts.pdfGenerated}</span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={mutation.isPending || !canGenerate}
      >
        <FileDown className="h-4 w-4" />
        {fr.contracts.generatePdf}
      </Button>
      {!canGenerate ? (
        <span className="text-xs text-muted-foreground">
          {fr.contracts.generateNoBodyHint}
        </span>
      ) : null}
    </div>
  );
}
