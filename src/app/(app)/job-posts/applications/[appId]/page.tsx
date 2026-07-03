import { ApplicationDetailView } from "@/features/job-posts/pages/application-detail";

export default async function ApplicationPage({ params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;
  return <ApplicationDetailView appId={appId} />;
}
