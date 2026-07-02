/**
 * Form → API mapping + the auto-fill placeholder reference for contract
 * templates. The backend resolves these from the consultant/contract; any other
 * `{{token}}` in a body is a manual field RH completes before PDF generation.
 */

import { fr } from "@/lib/i18n/fr";
import type { TemplateBody } from "@/features/contract-templates/contract-templates.api";
import type { TemplateForm } from "@/features/contract-templates/contract-templates.schemas";

/** Placeholders the backend auto-fills (mirror of the backend AUTO_PLACEHOLDERS). */
export const AUTO_PLACEHOLDERS = [
  "firstName",
  "lastName",
  "position",
  "tjm",
  "startDate",
  "endDate",
  "type",
] as const;

export function toTemplateBody(v: TemplateForm): TemplateBody {
  return { name: v.name.trim(), body: v.body };
}

/** Always French — the templates API has no special error codes. */
export function templateErrorMessage(): string {
  return fr.templates.saveError;
}
