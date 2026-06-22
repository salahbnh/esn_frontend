/**
 * Form → API payload mapping + error messaging for client dialogs. Explicit
 * field mapping (no spreading form state) so we never send unknown keys to the
 * backend's `.strict()` schema; empty optionals become `undefined`.
 */

import type {
  CreateClientBody,
  UpdateClientBody,
} from "@/features/clients/clients.types";
import type { ClientForm } from "@/features/clients/clients.schemas";

function blankToUndef(s?: string): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

export function toCreateClientBody(v: ClientForm): CreateClientBody {
  return {
    name: v.name.trim(),
    industry: blankToUndef(v.industry),
    contactName: blankToUndef(v.contactName),
    contactEmail: blankToUndef(v.contactEmail),
  };
}

export function toUpdateClientBody(v: ClientForm): UpdateClientBody {
  return toCreateClientBody(v);
}
