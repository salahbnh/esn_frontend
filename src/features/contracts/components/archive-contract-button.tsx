"use client";

import { Archive } from "lucide-react";
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
import { useArchiveContract } from "@/features/contracts/use-contracts";

/** Archive a contract (RH / DIRECTION). Confirmed in a dialog. */
export function ArchiveContractButton({ contractId }: { contractId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useArchiveContract(contractId);

  async function onConfirm() {
    try {
      await mutation.mutateAsync();
      toast.success(fr.contracts.archived);
      setOpen(false);
    } catch (err) {
      toast.error(contractErrorMessage(err));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Archive className="h-4 w-4" />
          {fr.contracts.archive}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.contracts.archiveConfirm}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {fr.contracts.cancel}
          </Button>
          <Button onClick={onConfirm} disabled={mutation.isPending}>
            {fr.contracts.archive}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
