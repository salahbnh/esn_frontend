import type { EmploymentType, QuestionType, SeniorityLevel } from "@/features/job-posts/job-posts.types";

export interface PublicQuestion {
  key: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  config?: { min?: number; max?: number; maxLength?: number };
  helpText?: string;
}

export interface PublicJob {
  token: string;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  employmentType: EmploymentType;
  seniorityLevel?: SeniorityLevel;
  minYearsExperience?: number;
  publishedAt: string | null;
  expiresAt?: string;
  requiredSkills: string[];
  questions: PublicQuestion[];
}

/** Discriminated result for the public job fetch. */
export type PublicJobResult =
  | { kind: "ok"; job: PublicJob }
  | { kind: "not_found" }
  | { kind: "closed" }
  | { kind: "error" };
