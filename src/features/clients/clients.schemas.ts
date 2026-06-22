/**
 * Client-side Zod schemas for client forms (react-hook-form). Mirror the backend
 * Zod for instant UX feedback — the server stays the authority. French messages.
 */

import { z } from "zod";

export const clientFormSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  industry: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z
    .string()
    .email("Email invalide")
    .optional()
    .or(z.literal("")),
});
export type ClientForm = z.infer<typeof clientFormSchema>;
