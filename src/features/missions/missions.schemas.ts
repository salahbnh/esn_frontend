/**
 * Client-side Zod schemas for mission forms (react-hook-form). Mirror the backend
 * Zod for instant UX feedback — the server stays the authority. French messages.
 */

import { z } from "zod";

const tjm = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Format attendu : 650.00");

export const missionFormSchema = z.object({
  clientId: z.string().min(1, "Client requis"),
  project: z.string().min(1, "Projet requis"),
  role: z.string().min(1, "Rôle requis"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Date de début requise"),
  endDate: z.string().optional(),
  tjm,
});
export type MissionForm = z.infer<typeof missionFormSchema>;

export const missionStatusChangeSchema = z.object({
  status: z.enum(["DRAFT", "STAFFED", "IN_PROGRESS", "CLOSED"]),
  comment: z.string().optional(),
});
export type MissionStatusChangeForm = z.infer<typeof missionStatusChangeSchema>;

/**
 * Structured amendment form — `reason` + `effectiveDate` are required; the rest
 * are optional fields that `form-helpers` rolls into the freeform `changes`
 * object (so we never expose a raw JSON textarea).
 */
export const amendmentFormSchema = z.object({
  reason: z.string().min(1, "Motif requis"),
  effectiveDate: z.string().min(1, "Date d'effet requise"),
  newTjm: tjm.optional().or(z.literal("")),
  newEndDate: z.string().optional(),
  newRole: z.string().optional(),
  note: z.string().optional(),
});
export type AmendmentForm = z.infer<typeof amendmentFormSchema>;
