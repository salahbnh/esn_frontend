"use client";

import { InfoField, InfoGrid } from "@/components/common/info-grid";
import { Award, CalendarOff, MapPin, Megaphone, Tags, Timer } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Copy, Link as LinkIcon, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { JobPostStatusBadge } from "@/features/job-posts/components/badges";
import { QuestionBuilder } from "@/features/job-posts/components/question-builder";
import { ApplicationList } from "@/features/job-posts/components/application-list";
import { jobPostErrorMessage } from "@/features/job-posts/form-helpers";
import { QueryBoundary } from "@/features/job-posts/query-boundary";
import {
  useArchiveJobPost,
  useCloseJobPost,
  useJobPost,
  usePublishJobPost,
} from "@/features/job-posts/use-job-posts";
import type { JobPostDetail } from "@/features/job-posts/job-posts.types";

export function JobPostDetailView({ id }: { id: string }) {
  const role = useSession().data?.user?.role ?? null;
  const canManage = role === "RH" || role === "DIRECTION";
  const query = useJobPost(id);
  const publish = usePublishJobPost(id);
  const close = useCloseJobPost(id);
  const archive = useArchiveJobPost(id);

  return (
    <QueryBoundary query={query}>
      {(post) => (
        <section className="space-y-6">
          <PageHeader icon={Megaphone} accent="jobPosts"
            title={post.title}
            subtitle={fr.jobPosts.employmentTypes[post.employmentType]}
            actions={
              <>
                <JobPostStatusBadge status={post.status} />
                {canManage ? (
                  <>
                    {post.status === "DRAFT" ? (
                      <Button asChild variant="outline">
                        <Link href={`/job-posts/${id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          {fr.jobPosts.edit}
                        </Link>
                      </Button>
                    ) : null}
                    {post.status === "DRAFT" || post.status === "CLOSED" ? (
                      <Button
                        onClick={() =>
                          publish.mutate(undefined, {
                            onSuccess: () => toast.success(fr.jobPosts.publishSuccess),
                            onError: (e) => toast.error(jobPostErrorMessage(e)),
                          })
                        }
                        disabled={publish.isPending}
                      >
                        {fr.jobPosts.publish}
                      </Button>
                    ) : null}
                    {post.status === "PUBLISHED" ? (
                      <Button
                        variant="outline"
                        onClick={() =>
                          close.mutate(undefined, {
                            onSuccess: () => toast.success(fr.jobPosts.closeSuccess),
                          })
                        }
                        disabled={close.isPending}
                      >
                        {fr.jobPosts.close}
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (!confirm(fr.jobPosts.archiveConfirm)) return;
                        archive.mutate(undefined, {
                          onSuccess: () => toast.success(fr.jobPosts.archiveSuccess),
                          onError: (e) => toast.error(jobPostErrorMessage(e)),
                        });
                      }}
                      disabled={archive.isPending}
                    >
                      {fr.jobPosts.archive}
                    </Button>
                  </>
                ) : null}
              </>
            }
          />

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">{fr.jobPosts.tabOverview}</TabsTrigger>
              <TabsTrigger value="questions">{fr.jobPosts.tabQuestions}</TabsTrigger>
              <TabsTrigger value="applications">{fr.jobPosts.tabApplications}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {post.status === "PUBLISHED" ? <PublicLink token={post.publicToken} /> : null}
              <Overview post={post} />
            </TabsContent>
            <TabsContent value="questions">
              <QuestionBuilder jobPostId={id} />
            </TabsContent>
            <TabsContent value="applications">
              <ApplicationList jobPostId={id} />
            </TabsContent>
          </Tabs>
        </section>
      )}
    </QueryBoundary>
  );
}

function PublicLink({ token }: { token: string }) {
  // Resolved in an effect — `window.location` in render would differ between the
  // server and client passes and trip a hydration mismatch.
  const [url, setUrl] = useState(`/jobs/${token}`);
  useEffect(() => {
    setUrl(`${window.location.origin}/jobs/${token}`);
  }, [token]);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-orange-500/25 bg-orange-500/5 p-3 dark:border-orange-400/20 dark:bg-orange-400/5">
      <LinkIcon
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-orange-600 dark:text-orange-300"
      />
      <span className="text-xs font-semibold uppercase text-muted-foreground">
        {fr.jobPosts.publicLink}
      </span>
      <code className="flex-1 truncate text-sm">{url}</code>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          void navigator.clipboard.writeText(url);
          toast.success(fr.jobPosts.linkCopied);
        }}
      >
        <Copy className="h-4 w-4" />
        {fr.jobPosts.copyLink}
      </Button>
    </div>
  );
}

function Overview({ post }: { post: JobPostDetail }) {
  return (
    <InfoGrid>
      <InfoField label={fr.jobPosts.description} full>
        <p className="whitespace-pre-wrap">{post.description}</p>
      </InfoField>
      {post.requirements ? (
        <InfoField label={fr.jobPosts.requirements} full>
          <p className="whitespace-pre-wrap">{post.requirements}</p>
        </InfoField>
      ) : null}
      <InfoField label={fr.jobPosts.location} icon={MapPin}>{post.location ?? "—"}</InfoField>
      <InfoField label={fr.jobPosts.seniorityLevel} icon={Award}>
        {post.seniorityLevel ? fr.jobPosts.seniorityLevels[post.seniorityLevel] : "—"}
      </InfoField>
      <InfoField label={fr.jobPosts.minYearsExperience} icon={Timer}>{post.minYearsExperience ?? "—"}</InfoField>
      <InfoField label={fr.jobPosts.expiresAt} icon={CalendarOff}>{formatDate(post.expiresAt)}</InfoField>
      <InfoField label={fr.jobPosts.requiredSkills} icon={Tags} full>
        <div className="flex flex-wrap gap-1.5">
          {post.requiredSkills.length === 0 ? "—" : post.requiredSkills.map((s) => (
            <Badge key={s.id} variant="secondary">{s.name}</Badge>
          ))}
        </div>
      </InfoField>
    </InfoGrid>
  );
}

