"use client";

import { Megaphone as PageIcon } from "lucide-react";
import { use } from "react";

import { PageHeader } from "@/components/common/page-header";
import { fr } from "@/lib/i18n/fr";
import { JobPostForm } from "@/features/job-posts/components/job-post-form";
import { QueryBoundary } from "@/features/job-posts/query-boundary";
import { useJobPost } from "@/features/job-posts/use-job-posts";

export default function EditJobPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const query = useJobPost(id);
  return (
    <section className="space-y-6">
      <PageHeader icon={PageIcon} accent="jobPosts" title={fr.jobPosts.editTitle} />
      <QueryBoundary query={query}>{(post) => <JobPostForm post={post} />}</QueryBoundary>
    </section>
  );
}
