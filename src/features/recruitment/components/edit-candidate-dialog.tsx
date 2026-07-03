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
  candidateErrorMessage,
  toUpdateBody,
} from "@/features/recruitment/form-helpers";
import {
  updateCandidateSchema,
  type UpdateCandidateForm,
} from "@/features/recruitment/recruitment.schemas";
import { useUpdateCandidate } from "@/features/recruitment/use-recruitment";
import { SkillPicker } from "@/features/skills/components/skill-picker";
import type { CandidateDetail } from "@/features/recruitment/recruitment.types";

function toFormValues(c: CandidateDetail): UpdateCandidateForm {
  return {
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone ?? "",
    source: c.source ?? "",
    targetPosition: c.targetPosition ?? "",
    notes: c.notes ?? "",
  };
}

/** RH-only "Modifier" dialog, prefilled from the candidate. */
export function EditCandidateDialog({ candidate }: { candidate: CandidateDetail }) {
  const [open, setOpen] = useState(false);
  const [skillIds, setSkillIds] = useState<string[]>(candidate.skills.map((s) => s.id));
  const mutation = useUpdateCandidate(candidate.id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCandidateForm>({
    resolver: zodResolver(updateCandidateSchema),
    defaultValues: toFormValues(candidate),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ ...toUpdateBody(values), skillIds });
      toast.success(fr.candidates.updateSuccess);
      setOpen(false);
    } catch (err) {
      toast.error(candidateErrorMessage(err));
    }
  });

  function onOpenChange(next: boolean) {
    // Re-sync the form to the latest candidate each time the dialog opens.
    if (next) {
      reset(toFormValues(candidate));
      setSkillIds(candidate.skills.map((s) => s.id));
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" />
          {fr.candidates.edit}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.candidates.edit}</DialogTitle>
          <DialogDescription>
            {candidate.firstName} {candidate.lastName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-firstName">{fr.candidates.firstName} *</Label>
              <Input id="edit-firstName" {...register("firstName")} />
              {errors.firstName ? (
                <p className="text-xs text-destructive">
                  {errors.firstName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-lastName">{fr.candidates.lastName} *</Label>
              <Input id="edit-lastName" {...register("lastName")} />
              {errors.lastName ? (
                <p className="text-xs text-destructive">
                  {errors.lastName.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-email">{fr.candidates.email} *</Label>
            <Input id="edit-email" type="email" {...register("email")} />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">{fr.candidates.phone}</Label>
              <Input id="edit-phone" {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-source">{fr.candidates.source}</Label>
              <Input id="edit-source" {...register("source")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-targetPosition">
              {fr.candidates.targetPosition}
            </Label>
            <Input id="edit-targetPosition" {...register("targetPosition")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-notes">{fr.candidates.notes}</Label>
            <Textarea id="edit-notes" rows={3} {...register("notes")} />
          </div>

          <div className="space-y-1.5">
            <Label>{fr.skills.fieldLabel}</Label>
            <SkillPicker value={skillIds} onChange={setSkillIds} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {fr.candidates.cancel}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {fr.candidates.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
