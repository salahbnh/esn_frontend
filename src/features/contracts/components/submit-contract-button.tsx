"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fr } from "@/lib/i18n/fr";
import { contractErrorMessage } from "@/features/contracts/form-helpers";
import { useSubmitContract } from "@/features/contracts/use-contracts";

/**
 * Submit a DRAFT contract into the validation circuit (DRAFT → INTERNAL_VALIDATION).
 * RH / DIRECTION. The backend creates the 3 PENDING validation rows.
 */
export function SubmitContractButton({ contractId }: { contractId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useSubmitContract(contractId);

  async function onConfirm() {
    try {
      await mutation.mutateAsync();
      toast.success(fr.contracts.submitSuccess);
      setOpen(false);
    } catch (err) {
      toast.error(contractErrorMessage(err));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send className="h-4 w-4" />
          {fr.contracts.submit}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.contracts.submit}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {fr.contracts.cancel}
          </Button>
          <Button onClick={onConfirm} disabled={mutation.isPending}>
            {fr.contracts.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
