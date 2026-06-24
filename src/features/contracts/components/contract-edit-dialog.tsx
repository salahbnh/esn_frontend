"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
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
import { fr } from "@/lib/i18n/fr";
import {
  contractErrorMessage,
  toUpdateContractBody,
} from "@/features/contracts/form-helpers";
import {
  contractEditSchema,
  type ContractEditForm,
} from "@/features/contracts/contracts.schemas";
import { useUpdateContract } from "@/features/contracts/use-contracts";
import type { ContractDetail } from "@/features/contracts/contracts.types";

function toFormValues(c: ContractDetail): ContractEditForm {
  return {
    type: c.type,
    startDate: c.startDate ? c.startDate.slice(0, 10) : "",
    endDate: c.endDate ? c.endDate.slice(0, 10) : "",
  };
}

/** Edit a DRAFT contract's type + dates (RH / DIRECTION). */
export function ContractEditDialog({ contract }: { contract: ContractDetail }) {
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateContract(contract.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContractEditForm>({
    resolver: zodResolver(contractEditSchema),
    defaultValues: toFormValues(contract),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateMutation.mutateAsync(toUpdateContractBody(values));
      toast.success(fr.contracts.updateSuccess);
      reset(values);
      setOpen(false);
    } catch (err) {
      toast.error(contractErrorMessage(err));
    }
  });

  function onOpenChange(next: boolean) {
    if (next) reset(toFormValues(contract));
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" />
          {fr.contracts.editTitle}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.contracts.editTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="contract-edit-type">{fr.contracts.type} *</Label>
            <Input id="contract-edit-type" {...register("type")} />
            {errors.type ? (
              <p className="text-xs text-destructive">{errors.type.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contract-edit-start">
                {fr.contracts.startDate}
              </Label>
              <Input
                id="contract-edit-start"
                type="date"
                {...register("startDate")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contract-edit-end">{fr.contracts.endDate}</Label>
              <Input
                id="contract-edit-end"
                type="date"
                {...register("endDate")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {fr.contracts.cancel}
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {fr.contracts.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
