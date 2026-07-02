"use client";

import { Ban } from "lucide-react";
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
import { templateErrorMessage } from "@/features/contract-templates/form-helpers";
import { useDeactivateTemplate } from "@/features/contract-templates/use-contract-templates";

/** Deactivate a template (RH/DIRECTION). There is no re-activate endpoint. */
export function DeactivateTemplateButton({ templateId }: { templateId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useDeactivateTemplate(templateId);

  async function onConfirm() {
    try {
      await mutation.mutateAsync();
      toast.success(fr.templates.deactivateSuccess);
      setOpen(false);
    } catch {
      toast.error(templateErrorMessage());
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={fr.templates.deactivate}>
          <Ban className="h-4 w-4 text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.templates.deactivateConfirm}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {fr.templates.cancel}
          </Button>
          <Button onClick={onConfirm} disabled={mutation.isPending}>
            {fr.templates.deactivate}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
