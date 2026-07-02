"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { fr } from "@/lib/i18n/fr";
import {
  AUTO_PLACEHOLDERS,
  templateErrorMessage,
  toTemplateBody,
} from "@/features/contract-templates/form-helpers";
import {
  templateFormSchema,
  type TemplateForm,
} from "@/features/contract-templates/contract-templates.schemas";
import {
  useCreateTemplate,
  useUpdateTemplate,
} from "@/features/contract-templates/use-contract-templates";
import type { ContractTemplate } from "@/features/contracts/contracts.types";

function toFormValues(t?: ContractTemplate): TemplateForm {
  return { name: t?.name ?? "", body: t?.body ?? "" };
}

/** Create (no `template`) or edit (with `template`) a contract template. RH/DIRECTION. */
export function TemplateFormDialog({ template }: { template?: ContractTemplate }) {
  const isEdit = Boolean(template);
  const [open, setOpen] = useState(false);
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate(template?.id ?? "");
  const mutation = isEdit ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TemplateForm>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: toFormValues(template),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(toTemplateBody(values));
        toast.success(fr.templates.updateSuccess);
      } else {
        await createMutation.mutateAsync(toTemplateBody(values));
        toast.success(fr.templates.createSuccess);
      }
      reset(isEdit ? values : toFormValues());
      setOpen(false);
    } catch {
      toast.error(templateErrorMessage());
    }
  });

  function onOpenChange(next: boolean) {
    if (next) reset(toFormValues(template));
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="sm" aria-label={fr.templates.editTitle}>
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" />
            {fr.templates.new}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? fr.templates.editTitle : fr.templates.new}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="tpl-name">{fr.templates.name} *</Label>
            <Input id="tpl-name" {...register("name")} />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tpl-body">{fr.templates.body} *</Label>
            <Textarea
              id="tpl-body"
              rows={12}
              className="font-mono text-xs"
              {...register("body")}
            />
            {errors.body ? (
              <p className="text-xs text-destructive">{errors.body.message}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">{fr.templates.bodyHint}</p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-medium text-muted-foreground">
                {fr.templates.autoPlaceholders}
              </span>
              {AUTO_PLACEHOLDERS.map((p) => (
                <Badge key={p} variant="secondary" className="font-mono">
                  {`{{${p}}}`}
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {fr.templates.cancel}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {isEdit ? fr.templates.save : fr.templates.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
