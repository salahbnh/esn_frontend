"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fr } from "@/lib/i18n/fr";
import {
  proposalFormSchema,
  type ProposalForm,
} from "@/features/recruitment/recruitment.schemas";
import { useCreateProposal } from "@/features/recruitment/use-recruitment";

const CONTRACT_TYPES = ["CDI", "CDD", "Freelance", "Stage"] as const;

const EMPTY: ProposalForm = {
  contractType: "CDI",
  position: "",
  tjm: "",
  startDate: "",
  duration: "",
  notes: "",
};

/** Build the backend `content` object from the form (drops empty fields). */
function toContent(v: ProposalForm): Record<string, unknown> {
  const content: Record<string, unknown> = {
    contractType: v.contractType,
    position: v.position.trim(),
  };
  if (v.tjm?.trim()) content.tjm = v.tjm.trim();
  if (v.startDate?.trim()) content.startDate = v.startDate;
  if (v.duration?.trim()) content.duration = v.duration.trim();
  if (v.notes?.trim()) content.notes = v.notes.trim();
  return content;
}

/** RH-only "Créer une proposition" dialog — a structured offer form. */
export function AddProposalDialog({ candidateId }: { candidateId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useCreateProposal(candidateId);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProposalForm>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ content: toContent(values) });
      toast.success(fr.candidates.proposalCreated);
      reset(EMPTY);
      setOpen(false);
    } catch {
      toast.error(fr.candidates.addError);
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
          {fr.candidates.addProposal}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.candidates.addProposal}</DialogTitle>
          <DialogDescription>{fr.candidates.tabProposals}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="proposal-contractType">
                {fr.candidates.proposalFields.contractType}
              </Label>
              <Controller
                control={control}
                name="contractType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="proposal-contractType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTRACT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proposal-position">
                {fr.candidates.proposalFields.position} *
              </Label>
              <Input id="proposal-position" {...register("position")} />
              {errors.position ? (
                <p className="text-xs text-destructive">
                  {errors.position.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="proposal-tjm">
                {fr.candidates.proposalFields.tjm}
              </Label>
              <Input
                id="proposal-tjm"
                inputMode="decimal"
                placeholder="650.00"
                {...register("tjm")}
              />
              {errors.tjm ? (
                <p className="text-xs text-destructive">{errors.tjm.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proposal-startDate">
                {fr.candidates.proposalFields.startDate}
              </Label>
              <Input
                id="proposal-startDate"
                type="date"
                {...register("startDate")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proposal-duration">
              {fr.candidates.proposalFields.duration}
            </Label>
            <Input
              id="proposal-duration"
              placeholder="12 mois"
              {...register("duration")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proposal-notes">
              {fr.candidates.proposalFields.notes}
            </Label>
            <Textarea id="proposal-notes" rows={3} {...register("notes")} />
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
