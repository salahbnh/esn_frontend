"use client";

import { useSession } from "next-auth/react";
import { Upload } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fr } from "@/lib/i18n/fr";
import type { DocumentType, EntityType } from "@/lib/types";
import { allowedUploadTypes } from "@/features/documents/documents.matrix";
import {
  acceptFor,
  documentErrorMessage,
  validateFile,
} from "@/features/documents/form-helpers";
import { useUploadDocument } from "@/features/documents/use-documents";

/** Upload a single document to `(entityType, entityId)`. Caller gates visibility. */
export function DocumentUploadDialog({
  entityType,
  entityId,
}: {
  entityType: EntityType;
  entityId: string;
}) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? null;
  const types = allowedUploadTypes(role);

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<DocumentType>(types[0] ?? "OTHER");
  const [file, setFile] = useState<File | null>(null);
  const mutation = useUploadDocument();

  function reset() {
    setType(types[0] ?? "OTHER");
    setFile(null);
  }

  async function onSubmit() {
    const code = validateFile(type, file);
    if (code) {
      toast.error(documentErrorMessage(code));
      return;
    }
    try {
      await mutation.mutateAsync({ file: file!, type, entityType, entityId });
      toast.success(fr.documents.uploadSuccess);
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(documentErrorMessage(err));
    }
  }

  function onOpenChange(next: boolean) {
    if (next) reset();
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Upload className="h-4 w-4" />
          {fr.documents.upload}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.documents.uploadTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="doc-type">{fr.documents.type}</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as DocumentType)}
            >
              <SelectTrigger id="doc-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {fr.status.document[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-file">{fr.documents.file}</Label>
            <input
              id="doc-file"
              type="file"
              accept={acceptFor(type)}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {fr.documents.cancel}
          </Button>
          <Button onClick={onSubmit} disabled={mutation.isPending || !file}>
            {fr.documents.upload}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
