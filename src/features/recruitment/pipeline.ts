import type { CandidateStatus } from "@/lib/types";
import type { ProposalStatus } from "@/features/recruitment/recruitment.types";

/** A status reachable via a manual transition (HIRED is convert-only). */
export type NextStatus = Exclude<CandidateStatus, "HIRED">;

/**
 * Candidate pipeline state machine — a mirror of the backend
 * `ALLOWED_TRANSITIONS` in `recruitment.service.ts`. Keep them in sync: the
 * server is authoritative and rejects anything not listed here. HIRED is
 * reached only through conversion, never a manual transition.
 */
export const ALLOWED_TRANSITIONS: Record<CandidateStatus, NextStatus[]> = {
  APPLIED: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["VALIDATED", "REJECTED"],
  VALIDATED: ["REJECTED"],
  REJECTED: [],
  HIRED: [],
};

export function allowedTransitions(status: CandidateStatus): NextStatus[] {
  return ALLOWED_TRANSITIONS[status];
}

/** A proposal status reachable via a manual transition (DRAFT is the initial). */
export type NextProposalStatus = Exclude<ProposalStatus, "DRAFT">;

/**
 * Proposal state machine — mirror of the backend `ALLOWED_PROPOSAL_TRANSITIONS`.
 * A new proposal starts at DRAFT; ACCEPTED/DECLINED are terminal.
 */
export const ALLOWED_PROPOSAL_TRANSITIONS: Record<
  ProposalStatus,
  NextProposalStatus[]
> = {
  DRAFT: ["SENT"],
  SENT: ["ACCEPTED", "DECLINED"],
  ACCEPTED: [],
  DECLINED: [],
};

export function allowedProposalTransitions(
  status: ProposalStatus,
): NextProposalStatus[] {
  return ALLOWED_PROPOSAL_TRANSITIONS[status];
}
