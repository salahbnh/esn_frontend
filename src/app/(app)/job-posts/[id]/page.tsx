import { JobPostDetailView } from "@/features/job-posts/pages/job-post-detail";

export default async function JobPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobPostDetailView id={id} />;
}
