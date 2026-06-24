/**
 * Contracts DTOs — frontend mirror of `backend/src/modules/contracts/*` +
 * `contract-templates/*` and the Prisma models.
 */

import type {
  ContractStatus,
  ContractValidationState,
  ContractValidationStep,
  ISODateString,
  PaginatedResult,
} from "@/lib/types";

export interface ContractConsultant {
  id: string;
  position: string;
  tjm: string | null;
  status: string;
  userId: string;
  user: { id: string; firstName: string; lastName: string };
}

/** The snapshot stored in `prefilledData` (template merge + manual fields). */
export interface PrefillData {
  fields: Record<string, string>;
  renderedBody: string;
  /** Template placeholders still without a (non-empty) value. */
  unfilled: string[];
}

export interface ContractValidation {
  id: string;
  contractId: string;
  step: ContractValidationStep;
  state: ContractValidationState;
  validatorId: string | null;
  decidedAt: ISODateString | null;
  comment: string | null;
  createdAt: ISODateString;
}

export interface ContractTemplate {
  id: string;
  name: string;
  body: string;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ContractAmendment {
  id: string;
  contractId: string;
  reason: string;
  changes: Record<string, unknown>;
  effectiveDate: ISODateString;
  createdAt: ISODateString;
}

/** Common contract row fields (list item). */
export interface Contract {
  id: string;
  consultantId: string;
  templateId: string | null;
  type: string;
  status: ContractStatus;
  generatedPdfId: string | null;
  signedPdfId: string | null;
  startDate: ISODateString | null;
  endDate: ISODateString | null;
  archivedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  consultant: ContractConsultant;
}

/** `GET /:id` — contract + template + validations + amendments + the prefill snapshot. */
export interface ContractDetail extends Contract {
  prefilledData: PrefillData;
  template: ContractTemplate | null;
  validations: ContractValidation[];
  amendments: ContractAmendment[];
}

// --- Request bodies --------------------------------------------------------

export interface CreateContractBody {
  consultantId: string;
  templateId?: string;
  type: string;
  startDate?: string;
  endDate?: string;
  fields?: Record<string, string>;
}

export interface UpdateContractBody {
  type?: string;
  startDate?: string;
  endDate?: string;
  fields?: Record<string, string>;
}

export interface ValidateStepBody {
  decision: "APPROVED" | "REJECTED";
  comment?: string;
}

export interface CreateContractAmendmentBody {
  reason: string;
  changes: Record<string, unknown>;
  effectiveDate: string;
}

// --- Query params + envelopes ----------------------------------------------

export interface ListContractsQuery {
  status?: ContractStatus;
  consultantId?: string;
  type?: string;
  search?: string;
  includeArchived?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export type ContractList = PaginatedResult<Contract>;
export type ContractAmendmentList = PaginatedResult<ContractAmendment>;
export type TemplateList = PaginatedResult<ContractTemplate>;
