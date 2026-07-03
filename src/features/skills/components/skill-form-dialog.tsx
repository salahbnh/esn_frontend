"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { skillErrorMessage } from "@/features/skills/form-helpers";
import { useCreateSkill, useUpdateSkill } from "@/features/skills/use-skills";
import type { Skill } from "@/lib/types";

const skillFormSchema = z.object({
  name: z.string().min(1, fr.skills.name).max(100),
  category: z.string().max(80).optional(),
});
type SkillForm = z.infer<typeof skillFormSchema>;

/** Create (no `skill`) or edit (with `skill`) a referential skill. RH/DIRECTION. */
export function SkillFormDialog({ skill }: { skill?: Skill }) {
  const isEdit = Boolean(skill);
  const [open, setOpen] = useState(false);
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill(skill?.id ?? "");
  const mutation = isEdit ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillForm>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: { name: skill?.name ?? "", category: skill?.category ?? "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const body = {
      name: values.name.trim(),
      ...(values.category?.trim() ? { category: values.category.trim() } : {}),
    };
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(body);
        toast.success(fr.skills.updateSuccess);
      } else {
        await createMutation.mutateAsync(body);
        toast.success(fr.skills.createSuccess);
      }
      setOpen(false);
    } catch (err) {
      toast.error(skillErrorMessage(err));
    }
  });

  function onOpenChange(next: boolean) {
    if (next) reset({ name: skill?.name ?? "", category: skill?.category ?? "" });
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4" />
            {fr.skills.edit}
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" />
            {fr.skills.new}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? fr.skills.editTitle : fr.skills.new}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="skill-name">{fr.skills.name} *</Label>
            <Input id="skill-name" {...register("name")} />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="skill-category">{fr.skills.category}</Label>
            <Input id="skill-category" placeholder="Backend" {...register("category")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {fr.skills.cancel}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {isEdit ? fr.skills.save : fr.skills.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
