/**
 * Status badge: renders a backend enum value as a French label inside a tinted
 * badge. Covers the entity enums (via `lib/format`'s `statusLabel`), the
 * reporting enums, and proposals. Each status maps to a semantic colour so
 * different stages are visually distinct (not just positive/neutral/negative).
 */

import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import {
  pipelineLabel,
  reportConsultantLabel,
  reportContractLabel,
  reportMissionLabel,
} from "@/features/reporting/report-labels";
import { cn } from "@/lib/utils";
import type {
  PipelineStage,
  ReportConsultantStatus,
  ReportContractStatus,
  ReportMissionStatus,
} from "@/features/reporting/reporting.types";
import type { ProposalStatus } from "@/features/recruitment/recruitment.types";
import type {
  AssignmentStatus,
  CandidateStatus,
  ConsultantStatus,
  ContractStatus,
  DocumentType,
  MissionStatus,
} from "@/lib/types";

/**
 * Semantic tones, each a distinct hue:
 *  neutral=grey · info=blue · attention=amber · review=violet ·
 *  active=teal · success=green · pending=indigo · danger=red
 */
type Tone =
  | "neutral"
  | "info"
  | "attention"
  | "review"
  | "active"
  | "success"
  | "pending"
  | "danger";

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  info: "bg-role-mgr/15 text-role-mgr border-transparent dark:bg-role-mgr/25",
  attention: "bg-role-rh/15 text-role-rh border-transparent dark:bg-role-rh/25",
  review: "bg-role-dir/15 text-role-dir border-transparent dark:bg-role-dir/25",
  active:
    "bg-role-cons/15 text-role-cons border-transparent dark:bg-role-cons/25",
  success: "bg-success/15 text-success border-transparent dark:bg-success/25",
  pending: "bg-primary/15 text-primary border-transparent dark:bg-primary/25",
  danger:
    "bg-destructive/15 text-destructive border-transparent dark:bg-destructive/25",
};

type Spec =
  | { kind: "candidate"; value: CandidateStatus }
  | { kind: "consultant"; value: ConsultantStatus }
  | { kind: "mission"; value: MissionStatus }
  | { kind: "assignment"; value: AssignmentStatus }
  | { kind: "contract"; value: ContractStatus }
  | { kind: "document"; value: DocumentType }
  | { kind: "proposal"; value: ProposalStatus }
  | { kind: "reportConsultant"; value: ReportConsultantStatus }
  | { kind: "reportMission"; value: ReportMissionStatus }
  | { kind: "reportContract"; value: ReportContractStatus }
  | { kind: "pipeline"; value: PipelineStage };

/**
 * Status value → tone. Values are unique enough across enums that one map works;
 * where a token is genuinely shared (VALIDATED, DRAFT…) the same tone is also the
 * right meaning everywhere. Semantically-equivalent states intentionally share a
 * hue (e.g. all inert/terminal states are grey).
 */
const TONE_BY_VALUE: Record<string, Tone> = {
  // --- Candidate pipeline (each stage distinct) ---
  APPLIED: "info", // new application
  INTERVIEW: "attention", // in progress
  VALIDATED: "review", // approved, awaiting next step
  REJECTED: "danger",
  HIRED: "success", // final positive outcome

  // --- Consultant availability ---
  INTERCONTRAT: "attention", // on the bench — needs staffing
  ON_MISSION: "active",
  AVAILABLE: "success",

  // --- Mission lifecycle ---
  DRAFT: "neutral",
  STAFFED: "info",
  IN_PROGRESS: "active",
  CLOSED: "neutral",
  ARCHIVED: "neutral",

  // --- Assignment (staffing) ---
  PROPOSED: "pending",
  CONFIRMED: "info",
  ACTIVE: "active",
  ENDED: "neutral",

  // --- Contract validation workflow ---
  INTERNAL_VALIDATION: "pending",
  PENDING_SIGNATURE: "pending",
  SIGNED: "success",

  // --- Proposal (offer) ---
  // DRAFT (neutral) reuses the token above.
  SENT: "info",
  ACCEPTED: "success",
  DECLINED: "danger",

  // --- Document types (tags, light semantics) ---
  CV: "info",
  CONTRACT: "review",
  AMENDMENT: "attention",
  OTHER: "neutral",
};

function toneFor(value: string): Tone {
  return TONE_BY_VALUE[value] ?? "neutral";
}

function labelFor(spec: Spec): string {
  switch (spec.kind) {
    case "proposal":
      return fr.candidates.proposalStatuses[spec.value];
    case "reportConsultant":
      return reportConsultantLabel(spec.value);
    case "reportMission":
      return reportMissionLabel(spec.value);
    case "reportContract":
      return reportContractLabel(spec.value);
    case "pipeline":
      return pipelineLabel(spec.value);
    default:
      return statusLabel(spec.kind, spec.value);
  }
}

export function StatusBadge(props: Spec & { className?: string }) {
  const { className, ...spec } = props;
  const tone = toneFor(spec.value);
  return (
    <Badge className={cn(toneClass[tone], className)}>{labelFor(spec)}</Badge>
  );
}
