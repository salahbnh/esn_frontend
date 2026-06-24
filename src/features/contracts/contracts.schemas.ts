/**
 * Client-side Zod schemas for contract forms (react-hook-form). Mirror the
 * backend Zod for instant UX feedback — the server stays the authority. The
 * dynamic "fill the placeholders" form is built from `prefilledData.unfilled`
 * in its component (not a static schema).
 */

import { z } from "zod";

export const contractCreateSchema = z.object({
  consultantId: z.string().min(1, "Consultant requis"),
  templateId: z.string().optional(),
  type: z.string().min(1, "Type requis"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
export type ContractCreateForm = z.infer<typeof contractCreateSchema>;

export const contractEditSchema = z.object({
  type: z.string().min(1, "Type requis"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
export type ContractEditForm = z.infer<typeof contractEditSchema>;

export const validateStepSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().optional(),
});
export type ValidateStepForm = z.infer<typeof validateStepSchema>;

export const contractAmendmentFormSchema = z.object({
  reason: z.string().min(1, "Motif requis"),
  effectiveDate: z.string().min(1, "Date d'effet requise"),
  newType: z.string().optional(),
  newEndDate: z.string().optional(),
  note: z.string().optional(),
});
export type ContractAmendmentForm = z.infer<typeof contractAmendmentFormSchema>;
