/**
 * Status badge: renders a backend enum value as a French label inside a tinted
 * badge. Covers the entity enums (via `lib/format`'s `statusLabel`) and the
 * reporting enums. Variant maps "positive/neutral/negative" buckets to badge
 * styles. Reused by every module that shows a status.
 */

import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/format";
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
import type {
  AssignmentStatus,
  CandidateStatus,
  ConsultantStatus,
  ContractStatus,
  DocumentType,
  MissionStatus,
} from "@/lib/types";

type Tone = "neutral" | "positive" | "warning" | "negative" | "info";

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  positive:
    "bg-role-cons/15 text-role-cons border-transparent dark:bg-role-cons/25",
  warning: "bg-role-rh/15 text-role-rh border-transparent dark:bg-role-rh/25",
  negative:
    "bg-destructive/15 text-destructive border-transparent dark:bg-destructive/25",
  info: "bg-role-mgr/15 text-role-mgr border-transparent dark:bg-role-mgr/25",
};

type Spec =
  | { kind: "candidate"; value: CandidateStatus }
  | { kind: "consultant"; value: ConsultantStatus }
  | { kind: "mission"; value: MissionStatus }
  | { kind: "assignment"; value: AssignmentStatus }
  | { kind: "contract"; value: ContractStatus }
  | { kind: "document"; value: DocumentType }
  | { kind: "reportConsultant"; value: ReportConsultantStatus }
  | { kind: "reportMission"; value: ReportMissionStatus }
  | { kind: "reportContract"; value: ReportContractStatus }
  | { kind: "pipeline"; value: PipelineStage };

const TONE_BY_VALUE: Record<string, Tone> = {
  // shared / cross-vocabulary tokens
  AVAILABLE: "positive",
  ON_MISSION: "info",
  INTERCONTRACT: "warning",
  INTERCONTRAT: "warning",
  REJECTED: "negative",
  CANCELLED: "negative",
  VALIDATED: "positive",
  SIGNED: "positive",
  HIRED: "positive",
  CONVERTED: "positive",
  IN_PROGRESS: "info",
  ACTIVE: "info",
  CLOSED: "neutral",
  ENDED: "neutral",
  ARCHIVED: "neutral",
  DRAFT: "neutral",
};

function toneFor(value: string): Tone {
  return TONE_BY_VALUE[value] ?? "info";
}

function labelFor(spec: Spec): string {
  switch (spec.kind) {
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
