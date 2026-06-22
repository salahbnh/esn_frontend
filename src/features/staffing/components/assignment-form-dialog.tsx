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
import { fr } from "@/lib/i18n/fr";
import { useConsultants } from "@/features/consultants/use-consultants";
import { useMissions } from "@/features/missions/use-missions";
import { SuggestionList } from "@/features/staffing/components/suggestion-list";
import {
  assignmentErrorMessage,
  isOverAllocated,
  toCreateAssignmentBody,
  toUpdateAssignmentBody,
} from "@/features/staffing/form-helpers";
import {
  assignmentFormSchema,
  type AssignmentForm,
} from "@/features/staffing/staffing.schemas";
import {
  useCreateAssignment,
  useUpdateAssignment,
} from "@/features/staffing/use-staffing";
import type { Assignment } from "@/features/staffing/staffing.types";

function toFormValues(a?: Assignment): AssignmentForm {
  return {
    missionId: a?.missionId ?? "",
    consultantId: a?.consultantId ?? "",
    roleOnMission: a?.roleOnMission ?? "",
    startDate: a?.startDate ? a.startDate.slice(0, 10) : "",
    endDate: a?.endDate ? a.endDate.slice(0, 10) : "",
    allocationPct: a?.allocationPct ?? 100,
  };
}

/** Create (no `assignment`) or edit (with `assignment`) — MANAGER/DIRECTION (parent-gated). */
export function AssignmentFormDialog({
  assignment,
}: {
  assignment?: Assignment;
}) {
  const isEdit = Boolean(assignment);
  const [open, setOpen] = useState(false);
  // When set, an over-allocation force-confirm is pending for these form values.
  const [forceValues, setForceValues] = useState<AssignmentForm | null>(null);
  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment(assignment?.id ?? "");
  const mutation = isEdit ? updateMutation : createMutation;

  // Only staffable missions can take a new assignment (the backend rejects
  // CLOSED/ARCHIVED with MISSION_NOT_STAFFABLE) — don't even offer them.
  const missions = (useMissions({ pageSize: 100 }).data?.data ?? []).filter(
    (m) => m.status !== "CLOSED" && m.status !== "ARCHIVED",
  );
  const consultants = useConsultants({ pageSize: 100 }).data?.data ?? [];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AssignmentForm>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: toFormValues(assignment),
  });

  const missionId = watch("missionId");
  const consultantId = watch("consultantId");

  async function submit(values: AssignmentForm, force: boolean) {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          ...toUpdateAssignmentBody(values),
          ...(force ? { force: true } : {}),
        });
        toast.success(fr.staffing.updateSuccess);
      } else {
        await createMutation.mutateAsync(toCreateAssignmentBody(values));
        toast.success(fr.staffing.createSuccess);
      }
      setForceValues(null);
      setOpen(false);
      if (!isEdit) reset(toFormValues());
    } catch (err) {
      // Raising an ACTIVE assignment's allocation past 100% → offer to force.
      if (isEdit && isOverAllocated(err)) {
        setForceValues(values);
        return;
      }
      toast.error(assignmentErrorMessage(err));
    }
  }

  const onSubmit = handleSubmit((v) => submit(v, false));

  function onOpenChange(next: boolean) {
    if (next) reset(toFormValues(assignment));
    else setForceValues(null);
    setOpen(next);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          {isEdit ? (
            <Button variant="outline">
              <Pencil className="h-4 w-4" />
              {fr.staffing.editTitle}
            </Button>
          ) : (
            <Button>
              <Plus className="h-4 w-4" />
              {fr.staffing.new}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? fr.staffing.editTitle : fr.staffing.new}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {isEdit ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ReadOnly label={fr.staffing.mission}>
                  {assignment!.mission.project}
                </ReadOnly>
                <ReadOnly label={fr.staffing.consultant}>
                  {assignment!.consultant.user.firstName}{" "}
                  {assignment!.consultant.user.lastName}
                </ReadOnly>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="assignment-mission">
                    {fr.staffing.mission} *
                  </Label>
                  <Controller
                    control={control}
                    name="missionId"
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="assignment-mission">
                          <SelectValue placeholder={fr.staffing.allMissions} />
                        </SelectTrigger>
                        <SelectContent>
                          {missions.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.project}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.missionId ? (
                    <p className="text-xs text-destructive">
                      {errors.missionId.message}
                    </p>
                  ) : null}
                </div>

                {missionId ? (
                  <SuggestionList
                    missionId={missionId}
                    selectedId={consultantId}
                    onSelect={(id) =>
                      setValue("consultantId", id, { shouldValidate: true })
                    }
                  />
                ) : null}

                <div className="space-y-1.5">
                  <Label htmlFor="assignment-consultant">
                    {fr.staffing.consultant} *
                  </Label>
                  <Controller
                    control={control}
                    name="consultantId"
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="assignment-consultant">
                          <SelectValue placeholder={fr.staffing.allConsultants} />
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
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="assignment-role">
                {fr.staffing.roleOnMission}
              </Label>
              <Input id="assignment-role" {...register("roleOnMission")} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="assignment-alloc">
                  {fr.staffing.allocation} % *
                </Label>
                <Input
                  id="assignment-alloc"
                  type="number"
                  min={1}
                  max={100}
                  {...register("allocationPct", { valueAsNumber: true })}
                />
                {errors.allocationPct ? (
                  <p className="text-xs text-destructive">
                    {errors.allocationPct.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="assignment-start">
                  {fr.staffing.startDate} *
                </Label>
                <Input
                  id="assignment-start"
                  type="date"
                  {...register("startDate")}
                />
                {errors.startDate ? (
                  <p className="text-xs text-destructive">
                    {errors.startDate.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="assignment-end">{fr.staffing.endDate}</Label>
                <Input
                  id="assignment-end"
                  type="date"
                  {...register("endDate")}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {fr.staffing.cancel}
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {isEdit ? fr.staffing.save : fr.staffing.create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Over-allocation force confirm (edit only) */}
      <Dialog
        open={forceValues !== null}
        onOpenChange={(o) => !o && setForceValues(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{fr.staffing.forceTitle}</DialogTitle>
            <DialogDescription>{fr.staffing.forceConfirm}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setForceValues(null)}
            >
              {fr.staffing.cancel}
            </Button>
            <Button
              type="button"
              disabled={mutation.isPending}
              onClick={() => forceValues && submit(forceValues, true)}
            >
              {fr.staffing.force}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ReadOnly({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm">{children}</p>
    </div>
  );
}
