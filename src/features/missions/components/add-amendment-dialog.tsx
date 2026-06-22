"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fr } from "@/lib/i18n/fr";
import {
  missionErrorMessage,
  toAmendmentBody,
} from "@/features/missions/form-helpers";
import {
  amendmentFormSchema,
  type AmendmentForm,
} from "@/features/missions/missions.schemas";
import { useCreateAmendment } from "@/features/missions/use-missions";

const EMPTY: AmendmentForm = {
  reason: "",
  effectiveDate: "",
  newTjm: "",
  newEndDate: "",
  newRole: "",
  note: "",
};

/** MANAGER/DIRECTION — add a mission amendment via a structured form (no raw JSON). */
export function AddAmendmentDialog({ missionId }: { missionId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useCreateAmendment(missionId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AmendmentForm>({
    resolver: zodResolver(amendmentFormSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(toAmendmentBody(values));
      toast.success(fr.missions.amendmentAdded);
      reset(EMPTY);
      setOpen(false);
    } catch (err) {
      toast.error(missionErrorMessage(err));
    }
  });

  function onOpenChange(next: boolean) {
    if (!next) reset(EMPTY);
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          {fr.missions.addAmendment}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.missions.addAmendment}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="amendment-reason">
              {fr.missions.amendmentReason} *
            </Label>
            <Input id="amendment-reason" {...register("reason")} />
            {errors.reason ? (
              <p className="text-xs text-destructive">
                {errors.reason.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amendment-date">
              {fr.missions.amendmentEffectiveDate} *
            </Label>
            <Input
              id="amendment-date"
              type="date"
              {...register("effectiveDate")}
            />
            {errors.effectiveDate ? (
              <p className="text-xs text-destructive">
                {errors.effectiveDate.message}
              </p>
            ) : null}
          </div>

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {fr.missions.amendmentChanges}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="amendment-tjm">{fr.missions.newTjm}</Label>
              <Input
                id="amendment-tjm"
                inputMode="decimal"
                placeholder="700.00"
                {...register("newTjm")}
              />
              {errors.newTjm ? (
                <p className="text-xs text-destructive">
                  {errors.newTjm.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amendment-end">{fr.missions.newEndDate}</Label>
              <Input
                id="amendment-end"
                type="date"
                {...register("newEndDate")}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="amendment-role">{fr.missions.newRole}</Label>
            <Input id="amendment-role" {...register("newRole")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="amendment-note">{fr.missions.note}</Label>
            <Textarea id="amendment-note" rows={2} {...register("note")} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {fr.missions.cancel}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {fr.missions.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
