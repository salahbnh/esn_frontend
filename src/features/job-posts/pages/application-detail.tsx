"use client";

import { InfoField, InfoGrid } from "@/components/common/info-grid";
import { SectionCard } from "@/components/common/section-card";
import {
  CalendarDays,
  FolderOpen,
  Mail,
  MessageSquareText,
  Phone,
  Tags,
  UserRound,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { ApplicationStatusBadge } from "@/features/job-posts/components/badges";
import { jobPostErrorMessage } from "@/features/job-posts/form-helpers";
import { QueryBoundary } from "@/features/job-posts/query-boundary";
import {
  useApplication,
  useLinkApplication,
  usePatchApplicationStatus,
} from "@/features/job-posts/use-job-posts";
import { useDocumentUrl } from "@/features/documents/use-documents";
import { documentErrorMessage } from "@/features/documents/form-helpers";
import type { AnswerSnapshot, ApplicationDetail } from "@/features/job-posts/job-posts.types";

export function ApplicationDetailView({ appId }: { appId: string }) {
  const role = useSession().data?.user?.role ?? null;
  const canManage = role === "RH" || role === "DIRECTION";
  const canLink = role === "RH";
  const query = useApplication(appId);

  return (
    <QueryBoundary query={query}>
      {(appli) => (
        <section className="space-y-6">
          <PageHeader icon={UserRound} accent="jobPosts"
            title={`${appli.firstName} ${appli.lastName}`}
            subtitle={appli.jobTitleSnapshot}
            actions={<ApplicationStatusBadge status={appli.status} />}
          />

          <InfoGrid>
            <InfoField label={fr.jobPosts.email} icon={Mail}>{appli.email}</InfoField>
            <InfoField label={fr.jobPosts.phone} icon={Phone}>{appli.phone ?? "—"}</InfoField>
            <InfoField label={fr.jobPosts.receivedAt} icon={CalendarDays}>{formatDate(appli.createdAt)}</InfoField>
          </InfoGrid>

          <Documents documents={appli.documents} />
          <Answers answers={appli.answers} />
          <DeclaredSkills skills={appli.declaredSkills} />

          {appli.rejectionReason ? (
            <p className="text-sm text-destructive">
              {fr.jobPosts.rejectReason}: {appli.rejectionReason}
            </p>
          ) : null}

          {canManage ? <Actions appli={appli} canLink={canLink} /> : null}
        </section>
      )}
    </QueryBoundary>
  );
}

function Documents({ documents }: { documents: ApplicationDetail["documents"] }) {
  const urlMutation = useDocumentUrl();
  async function download(id: string) {
    const tab = window.open("", "_blank");
    try {
      const { url } = await urlMutation.mutateAsync(id);
      if (tab) tab.location.href = url;
      else window.location.href = url;
    } catch (err) {
      tab?.close();
      toast.error(documentErrorMessage(err));
    }
  }
  if (documents.length === 0) return null;
  return (
    <SectionCard title={fr.jobPosts.documents} icon={FolderOpen} accent="documents">
      <div className="flex flex-wrap gap-2">
        {documents.map((d) => (
          <Button key={d.id} variant="outline" size="sm" onClick={() => download(d.id)}>
            <Download className="h-4 w-4" />
            {d.type} — {d.filename}
          </Button>
        ))}
      </div>
    </SectionCard>
  );
}

function Answers({ answers }: { answers: AnswerSnapshot[] }) {
  if (answers.length === 0) return null;
  return (
    <SectionCard title={fr.jobPosts.answers} icon={MessageSquareText} accent="jobPosts">
      <dl className="space-y-2">
        {answers.map((a) => (
          <div key={a.key} className="rounded-lg bg-muted/50 px-3 py-2.5">
            <dt className="text-xs font-medium text-muted-foreground">{a.label}</dt>
            <dd className="mt-0.5 text-sm">{formatAnswer(a.value)}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
}

function formatAnswer(value: AnswerSnapshot["value"]): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? fr.jobPosts.yes : fr.jobPosts.no;
  return String(value);
}

function DeclaredSkills({ skills }: { skills: ApplicationDetail["declaredSkills"] }) {
  if (!skills || skills.length === 0) return null;
  return (
    <SectionCard title={fr.jobPosts.declaredSkills} icon={Tags} accent="skills">
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <Badge key={s.name} variant="secondary">{s.name}</Badge>
        ))}
      </div>
    </SectionCard>
  );
}

function Actions({ appli, canLink }: { appli: ApplicationDetail; canLink: boolean }) {
  const patch = usePatchApplicationStatus(appli.id);
  const link = useLinkApplication(appli.id);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const isLinked = appli.status === "LINKED";

  function setStatus(status: "UNDER_REVIEW" | "SPAM") {
    patch.mutate({ status }, { onSuccess: () => toast.success(fr.jobPosts.statusUpdated) });
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      {isLinked ? (
        <Badge variant="secondary">{fr.jobPosts.linkedBadge}</Badge>
      ) : (
        <div className="flex flex-wrap gap-2">
          {canLink ? (
            <Button
              onClick={() => {
                if (!confirm(fr.jobPosts.linkConfirm)) return;
                link.mutate(undefined, {
                  onSuccess: () => toast.success(fr.jobPosts.linkSuccess),
                  onError: (e) => toast.error(jobPostErrorMessage(e)),
                });
              }}
              disabled={link.isPending}
            >
              {fr.jobPosts.link}
            </Button>
          ) : null}
          <Button variant="outline" onClick={() => setStatus("UNDER_REVIEW")} disabled={patch.isPending}>
            {fr.jobPosts.markUnderReview}
          </Button>
          <Button variant="outline" onClick={() => setRejecting((v) => !v)}>
            {fr.jobPosts.reject}
          </Button>
          <Button variant="outline" onClick={() => setStatus("SPAM")} disabled={patch.isPending}>
            {fr.jobPosts.markSpam}
          </Button>
        </div>
      )}

      {rejecting ? (
        <div className="space-y-2">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={fr.jobPosts.rejectReason}
          />
          <Button
            variant="destructive"
            onClick={() =>
              patch.mutate(
                { status: "REJECTED", rejectionReason: reason.trim() || undefined },
                {
                  onSuccess: () => {
                    toast.success(fr.jobPosts.statusUpdated);
                    setRejecting(false);
                    setReason("");
                  },
                },
              )
            }
            disabled={patch.isPending}
          >
            {fr.jobPosts.reject}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

