"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
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
import { toConvertBody } from "@/features/recruitment/form-helpers";
import {
  convertCandidateSchema,
  type ConvertCandidateForm,
} from "@/features/recruitment/recruitment.schemas";
import { useConvertCandidate } from "@/features/recruitment/use-recruitment";
import type { Candidate } from "@/features/recruitment/recruitment.types";

const EMPTY: ConvertCandidateForm = {
  position: "",
  hireDate: "",
  tjm: "",
  seniority: "",
  bio: "",
};

/**
 * RH/DIRECTION conversion of a VALIDATED candidate into a consultant. On success
 * we stay on the candidate detail (it refetches → status becomes HIRED and this
 * button disappears). Navigating to the new consultant's page will come with the
 * Consultants module (M4).
 */
export function ConvertCandidateDialog({
  candidate,
}: {
  candidate: Candidate;
}) {
  const [open, setOpen] = useState(false);
  const mutation = useConvertCandidate(candidate.id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConvertCandidateForm>({
    resolver: zodResolver(convertCandidateSchema),
    defaultValues: { ...EMPTY, position: candidate.targetPosition ?? "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(toConvertBody(values));
      toast.success(fr.candidates.convertSuccess);
      setOpen(false);
    } catch {
      toast.error(fr.candidates.convertError);
    }
  });

  function onOpenChange(next: boolean) {
    if (next) reset({ ...EMPTY, position: candidate.targetPosition ?? "" });
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4" />
          {fr.candidates.convert}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.candidates.convertTitle}</DialogTitle>
          <DialogDescription>{fr.candidates.convertHint}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="convert-position">{fr.candidates.position} *</Label>
            <Input id="convert-position" {...register("position")} />
            {errors.position ? (
              <p className="text-xs text-destructive">
                {errors.position.message}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="convert-hireDate">{fr.candidates.hireDate}</Label>
              <Input id="convert-hireDate" type="date" {...register("hireDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="convert-tjm">{fr.candidates.tjm}</Label>
              <Input
                id="convert-tjm"
                inputMode="decimal"
                placeholder="650.00"
                {...register("tjm")}
              />
              {errors.tjm ? (
                <p className="text-xs text-destructive">{errors.tjm.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="convert-seniority">{fr.candidates.seniority}</Label>
            <Input
              id="convert-seniority"
              placeholder="3 ans"
              {...register("seniority")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="convert-bio">{fr.candidates.bio}</Label>
            <Textarea id="convert-bio" rows={3} {...register("bio")} />
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
              {fr.candidates.convertConfirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
