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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { fr } from "@/lib/i18n/fr";
import { contractErrorMessage } from "@/features/contracts/form-helpers";
import { useSignContract } from "@/features/contracts/use-contracts";
import {
  acceptFor,
  documentErrorMessage,
  validateFile,
} from "@/features/documents/form-helpers";
import { useUploadDocument } from "@/features/documents/use-documents";

/**
 * Sign a PENDING_SIGNATURE contract (RH / DIRECTION): upload the signed PDF as a
 * CONTRACT document, then attach it via `PATCH /contracts/:id/sign` → SIGNED.
 */
export function SignContractDialog({ contractId }: { contractId: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const uploadMutation = useUploadDocument();
  const signMutation = useSignContract(contractId);
  const busy = uploadMutation.isPending || signMutation.isPending;

  async function onSubmit() {
    const code = validateFile("CONTRACT", file);
    if (code) {
      toast.error(documentErrorMessage(code));
      return;
    }
    try {
      const doc = await uploadMutation.mutateAsync({
        file: file!,
        type: "CONTRACT",
        entityType: "CONTRACT",
        entityId: contractId,
      });
      await signMutation.mutateAsync(doc.id);
      toast.success(fr.documents.signSuccess);
      setFile(null);
      setOpen(false);
    } catch (err) {
      // Upload errors carry document codes; the sign step carries contract codes.
      toast.error(
        uploadMutation.isError
          ? documentErrorMessage(err)
          : contractErrorMessage(err),
      );
    }
  }

  function onOpenChange(next: boolean) {
    if (next) setFile(null);
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PenLine className="h-4 w-4" />
          {fr.documents.sign}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.documents.signTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="sign-file">{fr.documents.signedPdf}</Label>
          <input
            id="sign-file"
            type="file"
            accept={acceptFor("CONTRACT")}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {fr.documents.cancel}
          </Button>
          <Button onClick={onSubmit} disabled={busy || !file}>
            {fr.documents.sign}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
