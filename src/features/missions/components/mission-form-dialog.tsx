"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { fr } from "@/lib/i18n/fr";
import { useClients } from "@/features/clients/use-clients";
import {
  missionErrorMessage,
  toCreateMissionBody,
  toUpdateMissionBody,
} from "@/features/missions/form-helpers";
import {
  missionFormSchema,
  type MissionForm,
} from "@/features/missions/missions.schemas";
import {
  useCreateMission,
  useUpdateMission,
} from "@/features/missions/use-missions";
import { SkillPicker } from "@/features/skills/components/skill-picker";
import type { MissionDetail } from "@/features/missions/missions.types";

function toFormValues(m?: MissionDetail): MissionForm {
  return {
    clientId: m?.clientId ?? "",
    project: m?.project ?? "",
    role: m?.role ?? "",
    description: m?.description ?? "",
    startDate: m?.startDate ? m.startDate.slice(0, 10) : "",
    endDate: m?.endDate ? m.endDate.slice(0, 10) : "",
    tjm: m?.tjm ?? "",
  };
}

/** Create (no `mission`) or edit (with `mission`) a mission. MANAGER/DIRECTION (parent-gated). */
export function MissionFormDialog({ mission }: { mission?: MissionDetail }) {
  const isEdit = Boolean(mission);
  const [open, setOpen] = useState(false);
  const [requiredSkillIds, setRequiredSkillIds] = useState<string[]>(
    mission?.requiredSkills.map((s) => s.id) ?? [],
  );
  const createMutation = useCreateMission();
  const updateMutation = useUpdateMission(mission?.id ?? "");
  const mutation = isEdit ? updateMutation : createMutation;
  const clients = useClients({ pageSize: 100 }).data?.data ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MissionForm>({
    resolver: zodResolver(missionFormSchema),
    defaultValues: toFormValues(mission),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ ...toUpdateMissionBody(values), requiredSkillIds });
        toast.success(fr.missions.updateSuccess);
      } else {
        await createMutation.mutateAsync({ ...toCreateMissionBody(values), requiredSkillIds });
        toast.success(fr.missions.createSuccess);
      }
      reset(isEdit ? values : toFormValues());
      setOpen(false);
    } catch (err) {
      toast.error(missionErrorMessage(err));
    }
  });

  function onOpenChange(next: boolean) {
    if (next) {
      reset(toFormValues(mission));
      setRequiredSkillIds(mission?.requiredSkills.map((s) => s.id) ?? []);
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline">
            <Pencil className="h-4 w-4" />
            {fr.missions.editTitle}
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" />
            {fr.missions.new}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? fr.missions.editTitle : fr.missions.new}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="mission-client">{fr.missions.client} *</Label>
            <Controller
              control={control}
              name="clientId"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="mission-client">
                    <SelectValue placeholder={fr.missions.allClients} />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.clientId ? (
              <p className="text-xs text-destructive">
                {errors.clientId.message}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="mission-project">{fr.missions.project} *</Label>
              <Input id="mission-project" {...register("project")} />
              {errors.project ? (
                <p className="text-xs text-destructive">
                  {errors.project.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mission-role">{fr.missions.role} *</Label>
              <Input id="mission-role" {...register("role")} />
              {errors.role ? (
                <p className="text-xs text-destructive">
                  {errors.role.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="mission-tjm">{fr.missions.tjm} *</Label>
              <Input
                id="mission-tjm"
                inputMode="decimal"
                placeholder="650.00"
                {...register("tjm")}
              />
              {errors.tjm ? (
                <p className="text-xs text-destructive">{errors.tjm.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mission-start">{fr.missions.startDate} *</Label>
              <Input id="mission-start" type="date" {...register("startDate")} />
              {errors.startDate ? (
                <p className="text-xs text-destructive">
                  {errors.startDate.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mission-end">{fr.missions.endDate}</Label>
              <Input id="mission-end" type="date" {...register("endDate")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mission-description">
              {fr.missions.description}
            </Label>
            <Textarea
              id="mission-description"
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{fr.skills.requiredLabel}</Label>
            <SkillPicker value={requiredSkillIds} onChange={setRequiredSkillIds} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {fr.missions.cancel}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {isEdit ? fr.missions.save : fr.missions.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
