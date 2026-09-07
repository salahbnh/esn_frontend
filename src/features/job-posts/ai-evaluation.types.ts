import type { ISODateString } from "@/lib/types";

/** Mirrors backend `ai-evaluations.schema.ts` (AiEvaluationDto / AiStatusDto). */

export type AiVerdict = "STRONG_MATCH" | "GOOD_MATCH" | "PARTIAL_MATCH" | "WEAK_MATCH";

export interface AiEvaluation {
  id: string;
  applicationId: string;
  score: number;
  verdict: AiVerdict;
  strengths: string[];
  gaps: string[];
  reasoning: string;
  cvUsed: boolean;
  model: string;
  promptVersion: string;
  tokensInput: number | null;
  tokensOutput: number | null;
  createdAt: ISODateString;
  createdBy: { id: string; firstName: string; lastName: string };
}

export interface AiStatus {
  configured: boolean;
}
