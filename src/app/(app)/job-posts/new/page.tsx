import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { authOptions } from "@/lib/auth";
import { fr } from "@/lib/i18n/fr";
import { PageHeader } from "@/components/common/page-header";
import { JobPostForm } from "@/features/job-posts/components/job-post-form";

export const metadata: Metadata = { title: fr.jobPosts.new };

export default async function NewJobPostPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;
  if (role !== "RH" && role !== "DIRECTION") redirect("/job-posts");
  return (
    <section className="space-y-6">
      <PageHeader title={fr.jobPosts.new} subtitle={fr.jobPosts.subtitle} />
      <JobPostForm />
    </section>
  );
}
