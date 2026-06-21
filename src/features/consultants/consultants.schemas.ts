/**
 * Client-side Zod schemas for consultant forms (react-hook-form resolvers).
 * Mirror the backend Zod for instant UX feedback — the server stays the real
 * authority. French messages so they surface directly in the UI.
 */

import { z } from "zod";

export const adminUpdateSchema = z.object({
  position: z.string().min(1, "Poste requis").optional(),
  tjm: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Format attendu : 650.00")
    .optional()
    .or(z.literal("")),
  seniority: z.string().optional(),
  bio: z.string().optional(),
  availabilityDate: z.string().optional(), // date-only input, expanded on submit
});
export type AdminUpdateForm = z.infer<typeof adminUpdateSchema>;

export const selfEditSchema = z.object({
  bio: z.string().optional(),
  seniority: z.string().optional(),
});
export type SelfEditForm = z.infer<typeof selfEditSchema>;

export const statusChangeSchema = z.object({
  status: z.enum(["AVAILABLE", "INTERCONTRAT", "ON_MISSION"]),
  comment: z.string().optional(),
});
export type StatusChangeForm = z.infer<typeof statusChangeSchema>;
