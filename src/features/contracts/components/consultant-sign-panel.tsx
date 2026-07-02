"use client";

import { Download, PenLine, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fr } from "@/lib/i18n/fr";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/common/status-badge";
import { contractErrorMessage } from "@/features/contracts/form-helpers";
import { canConsultantSign } from "@/features/contracts/contracts.workflow";
import {
  useConsultantSignContract,
  useRejectContract,
} from "@/features/contracts/use-contracts";
import { documentErrorMessage } from "@/features/documents/form-helpers";
import { useDocumentUrl } from "@/features/documents/use-documents";
import type { Contract } from "@/features/contracts/contracts.types";

/**
 * Consultant self-service sign / reject for ONE of their own contracts awaiting
 * their signature. Downloads the generated PDF, then Sign (in-app stamp) or
 * Reject with a reason (→ DRAFT). The API enforces ownership + state.
 */
export function ConsultantSignPanel({ contract }: { contract: Contract }) {
  const signMutation = useConsultantSignContract(contract.id);
  const rejectMutation = useRejectContract(contract.id);
  const urlMutation = useDocumentUrl();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const signable = canConsultantSign(contract);
  const busy = signMutation.isPending || rejectMutation.isPending;

  async function onDownload() {
    if (!contract.generatedPdfId) return;
    const tab = window.open("", "_blank");
    try {
      const { url } = await urlMutation.mutateAsync(contract.generatedPdfId);
      if (tab) tab.location.href = url;
      else window.location.href = url;
    } catch (err) {
      tab?.close();
      toast.error(documentErrorMessage(err));
    }
  }

  async function onSign() {
    try {
      await signMutation.mutateAsync();
      toast.success(fr.contracts.signSuccess);
    } catch (err) {
      toast.error(contractErrorMessage(err));
    }
  }

  async function onReject() {
    try {
      await rejectMutation.mutateAsync(reason.trim());
      toast.success(fr.contracts.rejectSuccess);
      setRejecting(false);
      setReason("");
    } catch (err) {
      toast.error(contractErrorMessage(err));
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{contract.type}</p>
          <p className="text-sm text-muted-foreground">
            {fr.contracts.startDate}: {formatDate(contract.startDate)}
          </p>
        </div>
        <StatusBadge kind="contract" value={contract.status} />
      </div>

      {contract.generatedPdfId ? (
        <Button variant="outline" onClick={onDownload} disabled={urlMutation.isPending}>
          <Download className="h-4 w-4" />
          {fr.contracts.downloadPdf}
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">{fr.contracts.needsPdfFirst}</p>
      )}

      {signable && contract.generatedPdfId ? (
        rejecting ? (
          <div className="space-y-2">
            <Label htmlFor={`reason-${contract.id}`}>{fr.contracts.rejectReason}</Label>
            <Textarea
              id={`reason-${contract.id}`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={fr.contracts.rejectHint}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setRejecting(false)} disabled={busy}>
                {fr.contracts.cancel}
              </Button>
              <Button
                variant="destructive"
                onClick={onReject}
                disabled={busy || reason.trim().length === 0}
              >
                {fr.contracts.reject_}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button onClick={onSign} disabled={busy}>
              <PenLine className="h-4 w-4" />
              {fr.contracts.consultantSign}
            </Button>
            <Button variant="outline" onClick={() => setRejecting(true)} disabled={busy}>
              <X className="h-4 w-4" />
              {fr.contracts.reject_}
            </Button>
          </div>
        )
      ) : null}
    </div>
  );
}
