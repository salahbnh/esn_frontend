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
  DialogDescription,
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
  consultantErrorMessage,
  toAdminUpdateBody,
} from "@/features/consultants/form-helpers";
import {
  adminUpdateSchema,
  type AdminUpdateForm,
} from "@/features/consultants/consultants.schemas";
import { useAdminUpdateConsultant } from "@/features/consultants/use-consultants";
import type { ConsultantDetail } from "@/features/consultants/consultants.types";

function toFormValues(c: ConsultantDetail): AdminUpdateForm {
  return {
    position: c.position,
    tjm: c.tjm ?? "",
    seniority: c.seniority ?? "",
    bio: c.bio ?? "",
    availabilityDate: c.availabilityDate ? c.availabilityDate.slice(0, 10) : "",
  };
}

/** RH/DIRECTION admin edit of a consultant's administrative profile. */
export function AdminEditDialog({ consultant }: { consultant: ConsultantDetail }) {
  const [open, setOpen] = useState(false);
  const mutation = useAdminUpdateConsultant(consultant.id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminUpdateForm>({
    resolver: zodResolver(adminUpdateSchema),
    defaultValues: toFormValues(consultant),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(toAdminUpdateBody(values));
      toast.success(fr.consultants.saveSuccess);
      setOpen(false);
    } catch (err) {
      toast.error(consultantErrorMessage(err));
    }
  });

  function onOpenChange(next: boolean) {
    if (next) reset(toFormValues(consultant));
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" />
          {fr.consultants.edit}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.consultants.editTitle}</DialogTitle>
          <DialogDescription>{fr.consultants.editHint}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="position">{fr.consultants.position}</Label>
            <Input id="position" {...register("position")} />
            {errors.position ? (
              <p className="text-xs text-destructive">
                {errors.position.message}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tjm">{fr.consultants.tjm}</Label>
              <Input
                id="tjm"
                inputMode="decimal"
                placeholder="650.00"
                {...register("tjm")}
              />
              {errors.tjm ? (
                <p className="text-xs text-destructive">{errors.tjm.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="availabilityDate">
                {fr.consultants.availabilityDate}
              </Label>
              <Input
                id="availabilityDate"
                type="date"
                {...register("availabilityDate")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seniority">{fr.consultants.seniority}</Label>
            <Input
              id="seniority"
              placeholder="3 ans"
              {...register("seniority")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">{fr.consultants.bio}</Label>
            <Textarea id="bio" rows={3} {...register("bio")} />
          </div>

          {/* TODO(skills): sélecteur de compétences — disponible après l'endpoint /api/skills. */}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {fr.consultants.cancel}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {fr.consultants.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
