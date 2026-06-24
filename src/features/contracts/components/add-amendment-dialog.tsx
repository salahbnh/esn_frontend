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
  contractErrorMessage,
  toContractAmendmentBody,
} from "@/features/contracts/form-helpers";
import {
  contractAmendmentFormSchema,
  type ContractAmendmentForm,
} from "@/features/contracts/contracts.schemas";
import { useCreateContractAmendment } from "@/features/contracts/use-contracts";

const EMPTY: ContractAmendmentForm = {
  reason: "",
  effectiveDate: "",
  newType: "",
  newEndDate: "",
  note: "",
};

/** RH / DIRECTION — add a contract amendment (SIGNED contracts only). */
export function AddAmendmentDialog({ contractId }: { contractId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useCreateContractAmendment(contractId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContractAmendmentForm>({
    resolver: zodResolver(contractAmendmentFormSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(toContractAmendmentBody(values));
      toast.success(fr.contracts.amendmentAdded);
      reset(EMPTY);
      setOpen(false);
    } catch (err) {
      toast.error(contractErrorMessage(err));
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
          {fr.contracts.addAmendment}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.contracts.addAmendment}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="camendment-reason">
              {fr.contracts.amendmentReason} *
            </Label>
            <Input id="camendment-reason" {...register("reason")} />
            {errors.reason ? (
              <p className="text-xs text-destructive">{errors.reason.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="camendment-date">
              {fr.contracts.amendmentEffectiveDate} *
            </Label>
            <Input
              id="camendment-date"
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
            {fr.contracts.amendmentChanges}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="camendment-type">{fr.contracts.newType}</Label>
              <Input id="camendment-type" {...register("newType")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="camendment-end">{fr.contracts.newEndDate}</Label>
              <Input
                id="camendment-end"
                type="date"
                {...register("newEndDate")}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="camendment-note">{fr.contracts.note}</Label>
            <Textarea id="camendment-note" rows={2} {...register("note")} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {fr.contracts.cancel}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {fr.contracts.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
