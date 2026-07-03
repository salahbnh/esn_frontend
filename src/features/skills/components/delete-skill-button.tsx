"use client";

import { Trash2 } from "lucide-react";
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
import { skillErrorMessage } from "@/features/skills/form-helpers";
import { useDeleteSkill } from "@/features/skills/use-skills";

/** Delete a skill (RH/DIRECTION). The API returns 409 SKILL_IN_USE if referenced. */
export function DeleteSkillButton({ skillId }: { skillId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useDeleteSkill();

  async function onConfirm() {
    try {
      await mutation.mutateAsync(skillId);
      toast.success(fr.skills.deleteSuccess);
      setOpen(false);
    } catch (err) {
      toast.error(skillErrorMessage(err));
      setOpen(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{fr.skills.deleteConfirm}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {fr.skills.cancel}
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={mutation.isPending}>
              {fr.skills.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
