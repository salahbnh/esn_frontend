"use client";

import { useSession } from "next-auth/react";
import { Download, Trash2 } from "lucide-react";
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
import { canDeleteDoc } from "@/features/documents/documents.matrix";
import { documentErrorMessage } from "@/features/documents/form-helpers";
import {
  useDeleteDocument,
  useDocumentUrl,
} from "@/features/documents/use-documents";

/** Download (presigned) + delete (RH/DIRECTION) actions for one document row. */
export function DocumentRowActions({ documentId }: { documentId: string }) {
  const { data: session } = useSession();
  const canDelete = canDeleteDoc(session?.user?.role ?? null);
  const urlMutation = useDocumentUrl();
  const deleteMutation = useDeleteDocument();
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function onDownload() {
    // Open a tab synchronously (avoids pop-up blocking), then point it at the
    // short-lived presigned URL once resolved.
    const tab = window.open("", "_blank");
    try {
      const { url } = await urlMutation.mutateAsync(documentId);
      if (tab) tab.location.href = url;
      else window.location.href = url;
    } catch (err) {
      tab?.close();
      toast.error(documentErrorMessage(err));
    }
  }

  async function onDelete() {
    try {
      await deleteMutation.mutateAsync(documentId);
      toast.success(fr.documents.deleteSuccess);
      setConfirmOpen(false);
    } catch (err) {
      toast.error(documentErrorMessage(err));
    }
  }

  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onDownload}
        disabled={urlMutation.isPending}
        aria-label={fr.documents.download}
        title={fr.documents.download}
      >
        <Download className="h-4 w-4" />
      </Button>

      {canDelete ? (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label={fr.documents.delete}
              title={fr.documents.delete}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{fr.documents.deleteConfirm}</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmOpen(false)}
              >
                {fr.documents.cancel}
              </Button>
              <Button onClick={onDelete} disabled={deleteMutation.isPending}>
                {fr.documents.delete}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
