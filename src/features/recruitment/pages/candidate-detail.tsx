"use client";

import { Compass, Mail, Phone, Tags, Target, Users } from "lucide-react";
import { InfoField, InfoGrid } from "@/components/common/info-grid";
import { useSession } from "next-auth/react";

import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { fr } from "@/lib/i18n/fr";
import { AddEvaluationDialog } from "@/features/recruitment/components/add-evaluation-dialog";
import { AddInteractionDialog } from "@/features/recruitment/components/add-interaction-dialog";
import { AddProposalDialog } from "@/features/recruitment/components/add-proposal-dialog";
import { ConvertCandidateDialog } from "@/features/recruitment/components/convert-candidate-dialog";
import { EditCandidateDialog } from "@/features/recruitment/components/edit-candidate-dialog";
import { DocumentsPanel } from "@/features/documents/components/documents-panel";
import { canDownloadFrom } from "@/features/documents/documents.matrix";
import { EvaluationList } from "@/features/recruitment/components/evaluation-list";
import { InteractionTimeline } from "@/features/recruitment/components/interaction-timeline";
import { ProposalList } from "@/features/recruitment/components/proposal-list";
import { PipelineStepper } from "@/features/recruitment/components/pipeline-stepper";
import { StatusTransition } from "@/features/recruitment/components/status-transition";
import { QueryBoundary } from "@/features/recruitment/query-boundary";
import { useCandidate } from "@/features/recruitment/use-recruitment";
import type { CandidateDetail } from "@/features/recruitment/recruitment.types";

export function CandidateDetailView({ id }: { id: string }) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? null;
  // The backend's GET proposals route allows RH + DIRECTION only — hide the tab
  // for MANAGER to avoid a guaranteed 403 (server stays authoritative anyway).
  const canSeeProposals = role === "RH" || role === "DIRECTION";
  const isRh = role === "RH";
  // Conversion (candidate → consultant) is RH + DIRECTION, VALIDATED only.
  const canConvert = role === "RH" || role === "DIRECTION";
  const canSeeDocs = canDownloadFrom(role, "CANDIDATE");

  const query = useCandidate(id);

  return (
    <QueryBoundary query={query}>
      {(candidate) => (
        <section className="space-y-6">
          <PageHeader icon={Users} accent="candidates"
            title={`${candidate.firstName} ${candidate.lastName}`}
            subtitle={candidate.targetPosition ?? undefined}
            actions={
              <>
                <StatusBadge kind="candidate" value={candidate.status} />
                {isRh ? <EditCandidateDialog candidate={candidate} /> : null}
                {canConvert && candidate.status === "VALIDATED" ? (
                  <ConvertCandidateDialog candidate={candidate} />
                ) : null}
              </>
            }
          />

          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">{fr.candidates.tabInfo}</TabsTrigger>
              <TabsTrigger value="interactions">
                {fr.candidates.tabInteractions}
              </TabsTrigger>
              <TabsTrigger value="evaluations">
                {fr.candidates.tabEvaluations}
              </TabsTrigger>
              {canSeeProposals ? (
                <TabsTrigger value="proposals">
                  {fr.candidates.tabProposals}
                </TabsTrigger>
              ) : null}
              {canSeeDocs ? (
                <TabsTrigger value="documents">
                  {fr.documents.title}
                </TabsTrigger>
              ) : null}
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <PipelineStepper status={candidate.status} />
              <CandidateInfo candidate={candidate} />
              {isRh ? (
                <StatusTransition
                  candidateId={id}
                  status={candidate.status}
                />
              ) : null}
            </TabsContent>
            <TabsContent value="interactions" className="space-y-4">
              <div className="flex justify-end">
                <AddInteractionDialog candidateId={id} />
              </div>
              <InteractionTimeline candidateId={id} />
            </TabsContent>
            <TabsContent value="evaluations" className="space-y-4">
              <div className="flex justify-end">
                <AddEvaluationDialog candidateId={id} />
              </div>
              <EvaluationList candidateId={id} />
            </TabsContent>
            {canSeeProposals ? (
              <TabsContent value="proposals" className="space-y-4">
                {isRh ? (
                  <div className="flex justify-end">
                    <AddProposalDialog candidateId={id} />
                  </div>
                ) : null}
                <ProposalList candidateId={id} canManage={isRh} />
              </TabsContent>
            ) : null}
            {canSeeDocs ? (
              <TabsContent value="documents">
                <DocumentsPanel entityType="CANDIDATE" entityId={id} />
              </TabsContent>
            ) : null}
          </Tabs>
        </section>
      )}
    </QueryBoundary>
  );
}

function CandidateInfo({ candidate }: { candidate: CandidateDetail }) {
  return (
    <InfoGrid>
      <InfoField label={fr.candidates.email} icon={Mail}>{candidate.email}</InfoField>
      <InfoField label={fr.candidates.phone} icon={Phone}>{candidate.phone ?? "—"}</InfoField>
      <InfoField label={fr.candidates.source} icon={Compass}>{candidate.source ?? "—"}</InfoField>
      <InfoField label={fr.candidates.targetPosition} icon={Target}>
        {candidate.targetPosition ?? "—"}
      </InfoField>
      <InfoField label={fr.candidates.skills} icon={Tags}>
        {candidate.skills.length > 0 ? (
          <span className="flex flex-wrap gap-1.5">
            {candidate.skills.map((s) => (
              <Badge key={s.id} variant="secondary">
                {s.name}
              </Badge>
            ))}
          </span>
        ) : (
          "—"
        )}
      </InfoField>
      <InfoField label={fr.candidates.notes} full>
        <span className="whitespace-pre-wrap">{candidate.notes ?? "—"}</span>
      </InfoField>
    </InfoGrid>
  );
}

