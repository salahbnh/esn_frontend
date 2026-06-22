/**
 * Client-side Zod schemas for staffing forms (react-hook-form). Mirror the
 * backend Zod for instant UX feedback — the server stays the authority.
 */

import { z } from "zod";

export const assignmentFormSchema = z.object({
  missionId: z.string().min(1, "Mission requise"),
  consultantId: z.string().min(1, "Consultant requis"),
  roleOnMission: z.string().optional(),
  startDate: z.string().min(1, "Date de début requise"),
  endDate: z.string().optional(),
  // Plain number (the input uses `valueAsNumber`) — avoids the z.coerce + zodResolver
  // input/output type mismatch.
  allocationPct: z
    .number({ message: "Entre 1 et 100" })
    .int()
    .min(1, "Entre 1 et 100")
    .max(100, "Entre 1 et 100"),
});
export type AssignmentForm = z.infer<typeof assignmentFormSchema>;

export const assignmentStatusChangeSchema = z.object({
  status: z.enum(["PROPOSED", "CONFIRMED", "ACTIVE", "ENDED"]),
  comment: z.string().optional(),
});
export type AssignmentStatusChangeForm = z.infer<
  typeof assignmentStatusChangeSchema
>;
