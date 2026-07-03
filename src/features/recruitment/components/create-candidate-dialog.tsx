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
  toCreateBody,
} from "@/features/recruitment/form-helpers";
import {
  createCandidateSchema,
  type CreateCandidateForm,
} from "@/features/recruitment/recruitment.schemas";
import { useCreateCandidate } from "@/features/recruitment/use-recruitment";
import { SkillPicker } from "@/features/skills/components/skill-picker";

const EMPTY: CreateCandidateForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  source: "",
  targetPosition: "",
  notes: "",
};

/** RH-only "Nouveau candidat" dialog. Self-contained trigger + form. */
export function CreateCandidateDialog() {
  const [open, setOpen] = useState(false);
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const mutation = useCreateCandidate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCandidateForm>({
    resolver: zodResolver(createCandidateSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ ...toCreateBody(values), skillIds });
      toast.success(fr.candidates.createSuccess);
      reset(EMPTY);
      setSkillIds([]);
      setOpen(false);
    } catch (err) {
      toast.error(candidateErrorMessage(err));
    }
  });

  function onOpenChange(next: boolean) {
    if (!next) {
      reset(EMPTY);
      setSkillIds([]);
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          {fr.candidates.new}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.candidates.new}</DialogTitle>
          <DialogDescription>{fr.candidates.subtitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">{fr.candidates.firstName} *</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName ? (
                <p className="text-xs text-destructive">
                  {errors.firstName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">{fr.candidates.lastName} *</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName ? (
                <p className="text-xs text-destructive">
                  {errors.lastName.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">{fr.candidates.email} *</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">{fr.candidates.phone}</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="source">{fr.candidates.source}</Label>
              <Input id="source" {...register("source")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="targetPosition">
              {fr.candidates.targetPosition}
            </Label>
            <Input id="targetPosition" {...register("targetPosition")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">{fr.candidates.notes}</Label>
            <Textarea id="notes" rows={3} {...register("notes")} />
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
              {fr.candidates.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
