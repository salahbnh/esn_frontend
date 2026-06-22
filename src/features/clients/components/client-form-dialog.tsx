"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { fr } from "@/lib/i18n/fr";
import {
  toCreateClientBody,
  toUpdateClientBody,
} from "@/features/clients/form-helpers";
import {
  clientFormSchema,
  type ClientForm,
} from "@/features/clients/clients.schemas";
import {
  useCreateClient,
  useUpdateClient,
} from "@/features/clients/use-clients";
import type { Client } from "@/features/clients/clients.types";

function toFormValues(c?: Client): ClientForm {
  return {
    name: c?.name ?? "",
    industry: c?.industry ?? "",
    contactName: c?.contactName ?? "",
    contactEmail: c?.contactEmail ?? "",
  };
}

/** Create (no `client`) or edit (with `client`) a client. Self-contained trigger. */
export function ClientFormDialog({ client }: { client?: Client }) {
  const isEdit = Boolean(client);
  const [open, setOpen] = useState(false);
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient(client?.id ?? "");
  const mutation = isEdit ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: toFormValues(client),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(toUpdateClientBody(values));
        toast.success(fr.clients.updateSuccess);
      } else {
        await createMutation.mutateAsync(toCreateClientBody(values));
        toast.success(fr.clients.createSuccess);
      }
      reset(isEdit ? values : toFormValues());
      setOpen(false);
    } catch {
      toast.error(fr.clients.saveError);
    }
  });

  function onOpenChange(next: boolean) {
    if (next) reset(toFormValues(client));
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline">
            <Pencil className="h-4 w-4" />
            {fr.clients.editTitle}
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" />
            {fr.clients.new}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? fr.clients.editTitle : fr.clients.new}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="client-name">{fr.clients.name} *</Label>
            <Input id="client-name" {...register("name")} />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="client-industry">{fr.clients.industry}</Label>
            <Input id="client-industry" {...register("industry")} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="client-contactName">
                {fr.clients.contactName}
              </Label>
              <Input id="client-contactName" {...register("contactName")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-contactEmail">
                {fr.clients.contactEmail}
              </Label>
              <Input
                id="client-contactEmail"
                type="email"
                {...register("contactEmail")}
              />
              {errors.contactEmail ? (
                <p className="text-xs text-destructive">
                  {errors.contactEmail.message}
                </p>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {fr.clients.cancel}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {isEdit ? fr.clients.save : fr.clients.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
