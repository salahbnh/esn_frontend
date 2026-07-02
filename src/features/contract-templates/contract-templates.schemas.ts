import { z } from "zod";

/** Client-side schema for the template create/edit form. Mirrors the backend. */
export const templateFormSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  body: z.string().min(1, "Corps requis"),
});
export type TemplateForm = z.infer<typeof templateFormSchema>;
