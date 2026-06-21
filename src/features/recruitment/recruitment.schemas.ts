/**
 * Client-side Zod schemas for recruitment forms (react-hook-form resolvers).
 * Mirror the backend Zod for instant UX feedback — the server remains the real
 * authority. French messages so they surface directly in the UI.
 */

import { z } from "zod";

export const createCandidateSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  source: z.string().optional(),
  targetPosition: z.string().optional(),
  notes: z.string().optional(),
});
export type CreateCandidateForm = z.infer<typeof createCandidateSchema>;

export const updateCandidateSchema = createCandidateSchema.partial();
export type UpdateCandidateForm = z.infer<typeof updateCandidateSchema>;

export const statusTransitionSchema = z.object({
  // HIRED is reached only via /convert, never a plain transition.
  status: z.enum(["APPLIED", "INTERVIEW", "VALIDATED", "REJECTED"]),
  comment: z.string().optional(),
});
export type StatusTransitionForm = z.infer<typeof statusTransitionSchema>;

export const createInteractionSchema = z.object({
  type: z.enum(["CALL", "EMAIL", "INTERVIEW", "NOTE"]),
  occurredAt: z.string().min(1, "Date requise"), // date-only from <input type="date">
  summary: z.string().min(1, "Résumé requis"),
});
export type CreateInteractionForm = z.infer<typeof createInteractionSchema>;

export const createEvaluationSchema = z.object({
  criteria: z.record(z.string(), z.number().int().min(0).max(10)).default({}),
  overallScore: z.coerce.number().int().min(0, "0–10").max(10, "0–10"),
  recommendation: z.string().optional(),
  comment: z.string().optional(),
});
export type CreateEvaluationForm = z.infer<typeof createEvaluationSchema>;

/** Structured offer form. Serialised to the backend's freeform `content` object. */
export const proposalFormSchema = z.object({
  contractType: z.enum(["CDI", "CDD", "Freelance", "Stage"]),
  position: z.string().min(1, "Poste requis"),
  tjm: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Format attendu : 650.00")
    .optional()
    .or(z.literal("")),
  startDate: z.string().optional(),
  duration: z.string().optional(),
  notes: z.string().optional(),
});
export type ProposalForm = z.infer<typeof proposalFormSchema>;

export const updateProposalStatusSchema = z.object({
  status: z.enum(["SENT", "ACCEPTED", "DECLINED"]),
});
export type UpdateProposalStatusForm = z.infer<typeof updateProposalStatusSchema>;

export const convertCandidateSchema = z.object({
  position: z.string().min(1, "Poste requis"),
  hireDate: z.string().optional(), // date-only, expanded on submit
  tjm: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Format attendu : 650.00")
    .optional()
    .or(z.literal("")),
  seniority: z.string().optional(),
  bio: z.string().optional(),
});
export type ConvertCandidateForm = z.infer<typeof convertCandidateSchema>;
