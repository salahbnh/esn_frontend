import type { Metadata } from "next";

import { fr } from "@/lib/i18n/fr";
import { JobPostsListView } from "@/features/job-posts/pages/job-posts-list";

export const metadata: Metadata = { title: fr.jobPosts.title };

export default function JobPostsPage() {
  return <JobPostsListView />;
}
