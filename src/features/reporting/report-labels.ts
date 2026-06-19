/**
 * French labels for the reporting-specific enum vocabularies (distinct from the
 * entity enums in `lib/format`). Single mapping point so charts/legends stay
 * consistent.
 */

import { fr } from "@/lib/i18n/fr";
import type {
  PipelineStage,
  ReportConsultantStatus,
  ReportContractStatus,
  ReportMissionStatus,
} from "@/features/reporting/reporting.types";

export function pipelineLabel(stage: PipelineStage): string {
  return fr.reportStatus.pipeline[stage] ?? stage;
}

export function reportMissionLabel(status: ReportMissionStatus): string {
  return fr.reportStatus.missions[status] ?? status;
}

export function reportContractLabel(status: ReportContractStatus): string {
  return fr.reportStatus.contracts[status] ?? status;
}

export function reportConsultantLabel(status: ReportConsultantStatus): string {
  return fr.reportStatus.consultant[status] ?? status;
}
