"use client";

import { PenLine } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fr } from "@/lib/i18n/fr";
import { contractErrorMessage } from "@/features/contracts/form-helpers";
import { useCountersignContract } from "@/features/contracts/use-contracts";

/**
 * RH/DIRECTION countersign action. Opens a confirmation dialog, then calls
 * `PATCH /contracts/:id/countersign` → SIGNED. Role gating is UX; the API enforces it.
 */
export function CountersignButton({ contractId }: { contractId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useCountersignContract(contractId);

  async function onConfirm() {
    try {
      await mutation.mutateAsync();
      toast.success(fr.contracts.countersignSuccess);
      setOpen(false);
    } catch (err) {
      toast.error(contractErrorMessage(err));
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PenLine className="h-4 w-4" />
        {fr.contracts.countersign}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{fr.contracts.countersignTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{fr.contracts.countersignHint}</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {fr.contracts.cancel}
            </Button>
            <Button onClick={onConfirm} disabled={mutation.isPending}>
              {fr.contracts.countersign}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
