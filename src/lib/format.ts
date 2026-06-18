/**
 * Display formatting helpers (French locale). Dates, money (TJM), and the
 * backend enum → French label mapping. Single place so the contract→label
 * mapping is consistent everywhere.
 */

import { fr } from "@/lib/i18n/fr";
import type {
  AssignmentStatus,
  CandidateStatus,
  ConsultantStatus,
  ContractStatus,
  DocumentType,
  ISODateString,
  MissionStatus,
  Role,
} from "@/lib/types";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const moneyFmt = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

/** ISO-8601 → "15/06/2026" (fr-FR). Empty/invalid input → "—". */
export function formatDate(iso?: ISODateString | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return dateFmt.format(d);
}

/** Decimal string ("650.00") or number → "650,00 €" (fr-FR EUR). */
export function formatTJM(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return "—";
  return moneyFmt.format(n);
}

type StatusMaps = {
  candidate: CandidateStatus;
  consultant: ConsultantStatus;
  mission: MissionStatus;
  assignment: AssignmentStatus;
  contract: ContractStatus;
  document: DocumentType;
};

/** Map a backend enum value to its French label, e.g. statusLabel("consultant","ON_MISSION") → "En mission". */
export function statusLabel<K extends keyof StatusMaps>(
  enumType: K,
  value: StatusMaps[K],
): string {
  const group = fr.status[enumType] as Record<string, string>;
  return group[value] ?? value;
}

/** French label for an application role. */
export function roleLabel(role: Role): string {
  return fr.roles[role] ?? role;
}
