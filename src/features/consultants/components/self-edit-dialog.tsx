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
  toSelfEditBody,
} from "@/features/consultants/form-helpers";
import {
  selfEditSchema,
  type SelfEditForm,
} from "@/features/consultants/consultants.schemas";
import { useSelfEditProfile } from "@/features/consultants/use-consultants";
import { SkillPicker } from "@/features/skills/components/skill-picker";
import type { ConsultantDetail } from "@/features/consultants/consultants.types";

/**
 * Consultant self-edit — intentionally narrow (bio + seniority only), matching
 * the backend `PATCH /me` schema. Position/TJM/status are admin-only.
 */
export function SelfEditDialog({ consultant }: { consultant: ConsultantDetail }) {
  const [open, setOpen] = useState(false);
  const [skillIds, setSkillIds] = useState<string[]>(consultant.skills.map((s) => s.id));
  const mutation = useSelfEditProfile();
  const { register, handleSubmit, reset } = useForm<SelfEditForm>({
    resolver: zodResolver(selfEditSchema),
    defaultValues: {
      bio: consultant.bio ?? "",
      seniority: consultant.seniority ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ ...toSelfEditBody(values), skillIds });
      toast.success(fr.consultants.saveSuccess);
      setOpen(false);
    } catch (err) {
      toast.error(consultantErrorMessage(err));
    }
  });

  function onOpenChange(next: boolean) {
    if (next) {
      reset({
        bio: consultant.bio ?? "",
        seniority: consultant.seniority ?? "",
      });
      setSkillIds(consultant.skills.map((s) => s.id));
    }
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
          <DialogTitle>{fr.consultants.selfEditTitle}</DialogTitle>
          <DialogDescription>{fr.consultants.selfEditHint}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="me-seniority">{fr.consultants.seniority}</Label>
            <Input
              id="me-seniority"
              placeholder="3 ans"
              {...register("seniority")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="me-bio">{fr.consultants.bio}</Label>
            <Textarea id="me-bio" rows={4} {...register("bio")} />
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
