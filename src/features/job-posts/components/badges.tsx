import { Badge } from "@/components/ui/badge";
import { fr } from "@/lib/i18n/fr";
import type { ApplicationStatus, JobPostStatus } from "@/features/job-posts/job-posts.types";

const JOB_TONE: Record<JobPostStatus, "secondary" | "outline" | "default"> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  CLOSED: "secondary",
};

export function JobPostStatusBadge({ status }: { status: JobPostStatus }) {
  return <Badge variant={JOB_TONE[status]}>{fr.jobPosts.status[status]}</Badge>;
}

const APP_TONE: Record<ApplicationStatus, "secondary" | "outline" | "default" | "destructive"> = {
  SUBMITTED: "default",
  UNDER_REVIEW: "outline",
  LINKED: "secondary",
  REJECTED: "destructive",
  SPAM: "destructive",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge variant={APP_TONE[status]}>{fr.jobPosts.appStatuses[status]}</Badge>;
}
