"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fr } from "@/lib/i18n/fr";
import { contractErrorMessage } from "@/features/contracts/form-helpers";
import { useUpdateContract } from "@/features/contracts/use-contracts";
import type { ContractDetail } from "@/features/contracts/contracts.types";

/**
 * Placeholders the backend derives automatically (consultant/contract). RH never
 * fills these — the server always overrides them — so the form prompts only for
 * MANUAL placeholders. Mirrors `AUTO_PLACEHOLDERS` in the backend.
 */
const AUTO_KEYS = new Set([
  "firstName",
  "lastName",
  "position",
  "tjm",
  "startDate",
  "endDate",
  "type",
]);

/**
 * Form to fill a DRAFT contract's remaining MANUAL template placeholders. The
 * backend replaces the whole manual `fields` set on update, so we resubmit the
 * already-filled manual values alongside the newly-entered ones.
 */
export function ContractFieldsForm({ contract }: { contract: ContractDetail }) {
  const updateMutation = useUpdateContract(contract.id);

  const manualUnfilled = contract.prefilledData.unfilled.filter(
    (name) => !AUTO_KEYS.has(name),
  );

  // Manual values already captured (preserved on resubmit).
  const existingManual: Record<string, string> = Object.fromEntries(
    Object.entries(contract.prefilledData.fields).filter(
      ([k, v]) => !AUTO_KEYS.has(k) && v !== "",
    ),
  );

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(manualUnfilled.map((name) => [name, ""])),
  );

  if (manualUnfilled.length === 0) return null;

  async function onSubmit() {
    const entered = Object.fromEntries(
      Object.entries(values)
        .map(([k, v]) => [k, v.trim()] as const)
        .filter(([, v]) => v !== ""),
    );
    try {
      await updateMutation.mutateAsync({
        fields: { ...existingManual, ...entered },
      });
      toast.success(fr.contracts.updateSuccess);
    } catch (err) {
      toast.error(contractErrorMessage(err));
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">{fr.contracts.fieldsToComplete}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {manualUnfilled.map((name) => (
          <div key={name} className="space-y-1.5">
            <Label htmlFor={`field-${name}`}>{name}</Label>
            <Input
              id={`field-${name}`}
              value={values[name] ?? ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [name]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={updateMutation.isPending}>
          {fr.contracts.save}
        </Button>
      </div>
    </div>
  );
}
