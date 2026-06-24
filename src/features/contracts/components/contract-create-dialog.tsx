"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fr } from "@/lib/i18n/fr";
import { useConsultants } from "@/features/consultants/use-consultants";
import {
  contractErrorMessage,
  toCreateContractBody,
} from "@/features/contracts/form-helpers";
import {
  contractCreateSchema,
  type ContractCreateForm,
} from "@/features/contracts/contracts.schemas";
import {
  useCreateContract,
  useTemplates,
} from "@/features/contracts/use-contracts";

const NONE = "NONE";

const BLANK: ContractCreateForm = {
  consultantId: "",
  templateId: "",
  type: "",
  startDate: "",
  endDate: "",
};

/** Create a contract (RH / DIRECTION), then navigate to its detail page. */
export function ContractCreateDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const createMutation = useCreateContract();
  const consultants = useConsultants({ pageSize: 100 }).data?.data ?? [];
  const templates = useTemplates().data?.data ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContractCreateForm>({
    resolver: zodResolver(contractCreateSchema),
    defaultValues: BLANK,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await createMutation.mutateAsync(
        toCreateContractBody(values),
      );
      toast.success(fr.contracts.createSuccess);
      reset(BLANK);
      setOpen(false);
      router.push(`/contracts/${created.id}`);
    } catch (err) {
      toast.error(contractErrorMessage(err));
    }
  });

  function onOpenChange(next: boolean) {
    if (next) reset(BLANK);
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          {fr.contracts.new}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.contracts.new}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="contract-consultant">
              {fr.contracts.consultant} *
            </Label>
            <Controller
              control={control}
              name="consultantId"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="contract-consultant">
                    <SelectValue placeholder={fr.contracts.consultant} />
                  </SelectTrigger>
                  <SelectContent>
                    {consultants.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.user.firstName} {c.user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.consultantId ? (
              <p className="text-xs text-destructive">
                {errors.consultantId.message}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contract-type">{fr.contracts.type} *</Label>
              <Input id="contract-type" placeholder="CDI" {...register("type")} />
              {errors.type ? (
                <p className="text-xs text-destructive">{errors.type.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contract-template">{fr.contracts.template}</Label>
              <Controller
                control={control}
                name="templateId"
                render={({ field }) => (
                  <Select
                    value={field.value || NONE}
                    onValueChange={(v) => field.onChange(v === NONE ? "" : v)}
                  >
                    <SelectTrigger id="contract-template">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>
                        {fr.contracts.noTemplate}
                      </SelectItem>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contract-start">{fr.contracts.startDate}</Label>
              <Input
                id="contract-start"
                type="date"
                {...register("startDate")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contract-end">{fr.contracts.endDate}</Label>
              <Input id="contract-end" type="date" {...register("endDate")} />
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
            <Button type="submit" disabled={createMutation.isPending}>
              {fr.contracts.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
