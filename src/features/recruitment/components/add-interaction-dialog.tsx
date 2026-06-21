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
  createInteractionSchema,
  type CreateInteractionForm,
} from "@/features/recruitment/recruitment.schemas";
import { useAddInteraction } from "@/features/recruitment/use-recruitment";

const TYPES = ["CALL", "EMAIL", "INTERVIEW", "NOTE"] as const;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Add an interaction (RH/MANAGER/DIRECTION). Self-contained trigger + form. */
export function AddInteractionDialog({ candidateId }: { candidateId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useAddInteraction(candidateId);

  function defaults(): CreateInteractionForm {
    return { type: "NOTE", occurredAt: today(), summary: "" };
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateInteractionForm>({
    resolver: zodResolver(createInteractionSchema),
    defaultValues: defaults(),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      // The API layer expands the date-only `occurredAt` to a full ISO datetime.
      await mutation.mutateAsync(values);
      toast.success(fr.candidates.interactionSuccess);
      reset(defaults());
      setOpen(false);
    } catch {
      toast.error(fr.candidates.addError);
    }
  });

  function onOpenChange(next: boolean) {
    if (next) reset(defaults());
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          {fr.candidates.add}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{fr.candidates.addInteraction}</DialogTitle>
          <DialogDescription>{fr.candidates.tabInteractions}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="interaction-type">
                {fr.candidates.interactionType}
              </Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="interaction-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {fr.candidates.interactionTypes[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="interaction-date">
                {fr.candidates.occurredAt}
              </Label>
              <Input
                id="interaction-date"
                type="date"
                {...register("occurredAt")}
              />
              {errors.occurredAt ? (
                <p className="text-xs text-destructive">
                  {errors.occurredAt.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="interaction-summary">{fr.candidates.summary}</Label>
            <Textarea
              id="interaction-summary"
              rows={3}
              {...register("summary")}
            />
            {errors.summary ? (
              <p className="text-xs text-destructive">
                {errors.summary.message}
              </p>
            ) : null}
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
              {fr.candidates.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
