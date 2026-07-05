"use client";

import { Banknote, Briefcase, Building2, CalendarDays, CalendarOff, Tags, User, Users } from "lucide-react";
import { InfoField, InfoGrid } from "@/components/common/info-grid";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatDate, formatTJM } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";
import { AddAmendmentDialog } from "@/features/missions/components/add-amendment-dialog";
import { AmendmentList } from "@/features/missions/components/amendment-list";
import { ArchiveMissionButton } from "@/features/missions/components/archive-mission-button";
import { MissionFormDialog } from "@/features/missions/components/mission-form-dialog";
import { MissionStatusControl } from "@/features/missions/components/mission-status-control";
import { DocumentsPanel } from "@/features/documents/components/documents-panel";
import { QueryBoundary } from "@/features/missions/query-boundary";
import { useMission } from "@/features/missions/use-missions";
import type { MissionDetail } from "@/features/missions/missions.types";

export function MissionDetailView({ id }: { id: string }) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? null;
  const isConsultant = role === "CONSULTANT";
  // GET /:id/amendments is RH/MGR/DIR only — hide the tab from a CONSULTANT.
  const canSeeAmendments = !isConsultant;
  // Mission writes (edit / status / archive / amendment) are MANAGER + DIRECTION.
  const canManage = role === "MANAGER" || role === "DIRECTION";

  const query = useMission(id);

  return (
    <QueryBoundary query={query}>
      {(mission) => (
        <section className="space-y-6">
          <PageHeader icon={Briefcase} accent="missions"
            title={mission.project}
            actions={
              <>
                <StatusBadge kind="mission" value={mission.status} />
                {canManage ? (
                  <>
                    <MissionFormDialog mission={mission} />
                    {mission.status !== "ARCHIVED" ? (
                      <ArchiveMissionButton missionId={id} />
                    ) : null}
                  </>
                ) : null}
              </>
            }
          />

          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">{fr.missions.tabInfo}</TabsTrigger>
              {canSeeAmendments ? (
                <TabsTrigger value="amendments">
                  {fr.missions.tabAmendments}
                </TabsTrigger>
              ) : null}
              <TabsTrigger value="documents">{fr.documents.title}</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <MissionInfo mission={mission} isConsultant={isConsultant} />
              {canManage ? (
                <MissionStatusControl
                  missionId={id}
                  status={mission.status}
                />
              ) : null}
            </TabsContent>
            {canSeeAmendments ? (
              <TabsContent value="amendments" className="space-y-4">
                {canManage ? (
                  <div className="flex justify-end">
                    <AddAmendmentDialog missionId={id} />
                  </div>
                ) : null}
                <AmendmentList missionId={id} />
              </TabsContent>
            ) : null}
            <TabsContent value="documents">
              <DocumentsPanel entityType="MISSION" entityId={id} />
            </TabsContent>
          </Tabs>
        </section>
      )}
    </QueryBoundary>
  );
}

function MissionInfo({
  mission,
  isConsultant,
}: {
  mission: MissionDetail;
  isConsultant: boolean;
}) {
  return (
    <InfoGrid>
      <InfoField label={fr.missions.role} icon={User}>{mission.role}</InfoField>
      <InfoField label={fr.missions.client} icon={Building2}>
        {isConsultant ? (
          mission.client.name
        ) : (
          <Link
            href={`/clients/${mission.client.id}`}
            className="text-primary hover:underline"
          >
            {mission.client.name}
          </Link>
        )}
      </InfoField>
      <InfoField label={fr.missions.tjm} icon={Banknote}>{formatTJM(mission.tjm)}</InfoField>
      <InfoField label={fr.missions.startDate} icon={CalendarDays}>
        {formatDate(mission.startDate)}
      </InfoField>
      <InfoField label={fr.missions.endDate} icon={CalendarOff}>{formatDate(mission.endDate)}</InfoField>
      <InfoField label={fr.missions.assignmentCount} icon={Users}>
        {isConsultant ? (
          <span className="tabular-nums">{mission._activeAssignmentCount}</span>
        ) : (
          <Link
            href={`/staffing?missionId=${mission.id}`}
            className="tabular-nums text-primary hover:underline"
          >
            {mission._activeAssignmentCount} ›
          </Link>
        )}
      </InfoField>
      <InfoField label={fr.missions.requiredSkills} icon={Tags}>
        {mission.requiredSkills.length > 0 ? (
          <span className="flex flex-wrap gap-1.5">
            {mission.requiredSkills.map((s) => (
              <Badge key={s.id} variant="secondary">
                {s.name}
              </Badge>
            ))}
          </span>
        ) : (
          "—"
        )}
      </InfoField>
      <InfoField label={fr.missions.description} full>
        <span className="whitespace-pre-wrap">
          {mission.description ?? "—"}
        </span>
      </InfoField>
    </InfoGrid>
  );
}

