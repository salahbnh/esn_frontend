"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Copy, Pencil } from "lucide-react";
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
          <PageHeader
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
                          {fr.jobPosts.save}
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
  const url = typeof window !== "undefined" ? `${window.location.origin}/jobs/${token}` : `/jobs/${token}`;
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3">
      <span className="text-xs font-semibold uppercase text-muted-foreground">{fr.jobPosts.publicLink}</span>
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
    <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      <Field label={fr.jobPosts.description} full>
        <p className="whitespace-pre-wrap">{post.description}</p>
      </Field>
      {post.requirements ? (
        <Field label={fr.jobPosts.requirements} full>
          <p className="whitespace-pre-wrap">{post.requirements}</p>
        </Field>
      ) : null}
      <Field label={fr.jobPosts.location}>{post.location ?? "—"}</Field>
      <Field label={fr.jobPosts.seniorityLevel}>
        {post.seniorityLevel ? fr.jobPosts.seniorityLevels[post.seniorityLevel] : "—"}
      </Field>
      <Field label={fr.jobPosts.minYearsExperience}>{post.minYearsExperience ?? "—"}</Field>
      <Field label={fr.jobPosts.expiresAt}>{formatDate(post.expiresAt)}</Field>
      <Field label={fr.jobPosts.requiredSkills} full>
        <div className="flex flex-wrap gap-1.5">
          {post.requiredSkills.length === 0 ? "—" : post.requiredSkills.map((s) => (
            <Badge key={s.id} variant="secondary">{s.name}</Badge>
          ))}
        </div>
      </Field>
    </dl>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}
