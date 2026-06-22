"use client";

import { Archive } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fr } from "@/lib/i18n/fr";
import { missionErrorMessage } from "@/features/missions/form-helpers";
import { useArchiveMission } from "@/features/missions/use-missions";

/** MANAGER/DIRECTION archive action with a confirm step (archival is terminal). */
export function ArchiveMissionButton({ missionId }: { missionId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useArchiveMission(missionId);

  async function onConfirm() {
    try {
      await mutation.mutateAsync();
      toast.success(fr.missions.archived);
      setOpen(false);
    } catch (err) {
      toast.error(missionErrorMessage(err));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Archive className="h-4 w-4" />
          {fr.missions.archive}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.missions.archive}</DialogTitle>
          <DialogDescription>{fr.missions.archiveConfirm}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {fr.missions.cancel}
          </Button>
          <Button
            type="button"
            className="text-destructive"
            disabled={mutation.isPending}
            onClick={onConfirm}
          >
            {fr.missions.archive}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
