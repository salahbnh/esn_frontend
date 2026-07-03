import type { ISODateString, PaginatedResult } from "@/lib/types";

export type JobPostStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type ApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "LINKED"
  | "REJECTED"
  | "SPAM";
export type EmploymentType = "CDI" | "CDD" | "STAGE" | "FREELANCE";
export type SeniorityLevel = "JUNIOR" | "CONFIRMED" | "SENIOR" | "LEAD";
export type QuestionType =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "SINGLE_CHOICE"
  | "MULTI_CHOICE"
  | "BOOLEAN"
  | "NUMBER";

export interface JobQuestion {
  id: string;
  jobPostId: string;
  key: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options: string[] | null;
  config: { min?: number; max?: number; maxLength?: number } | null;
  order: number;
  helpText: string | null;
}

export interface JobPostListItem {
  id: string;
  title: string;
  status: JobPostStatus;
  employmentType: EmploymentType;
  location: string | null;
  publicToken: string;
  createdAt: ISODateString;
  requiredSkills: { id: string; name: string }[];
  _count: { applications: number };
}

export interface JobPostDetail {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  employmentType: EmploymentType;
  seniorityLevel: SeniorityLevel | null;
  minYearsExperience: number | null;
  status: JobPostStatus;
  publicToken: string;
  publishedAt: ISODateString | null;
  expiresAt: ISODateString | null;
  createdAt: ISODateString;
  requiredSkills: { id: string; name: string; category: string | null }[];
  questions: JobQuestion[];
  author: { id: string; firstName: string; lastName: string };
}

export interface ApplicationListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: ApplicationStatus;
  candidateId: string | null;
  createdAt: ISODateString;
}

export interface AnswerSnapshot {
  key: string;
  label: string;
  type: QuestionType;
  value: string | number | boolean | string[];
}

export interface ApplicationDetail {
  id: string;
  jobPostId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: ApplicationStatus;
  candidateId: string | null;
  jobTitleSnapshot: string;
  answers: AnswerSnapshot[];
  declaredSkills: { name: string }[] | null;
  rejectionReason: string | null;
  createdAt: ISODateString;
  jobPost: { id: string; title: string };
  documents: {
    id: string;
    type: string;
    filename: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: ISODateString;
  }[];
}

// --- Request bodies --------------------------------------------------------

export interface JobPostBody {
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  employmentType: EmploymentType;
  seniorityLevel?: SeniorityLevel;
  minYearsExperience?: number;
  expiresAt?: string;
  skillIds?: string[];
}

export interface CreateQuestionBody {
  key: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  options?: string[];
  config?: { min?: number; max?: number; maxLength?: number };
  helpText?: string;
}

export type UpdateQuestionBody = Omit<Partial<CreateQuestionBody>, "key" | "type">;

export interface PatchApplicationStatusBody {
  status: "UNDER_REVIEW" | "REJECTED" | "SPAM";
  rejectionReason?: string;
}

export interface ListJobPostsQuery {
  status?: JobPostStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export type JobPostList = PaginatedResult<JobPostListItem>;
export type ApplicationList = PaginatedResult<ApplicationListItem>;
