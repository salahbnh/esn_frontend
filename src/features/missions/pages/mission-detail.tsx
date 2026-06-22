"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import type { ReactNode } from "react";

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
          <PageHeader
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
    <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      <Field label={fr.missions.role}>{mission.role}</Field>
      <Field label={fr.missions.client}>
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
      </Field>
      <Field label={fr.missions.tjm}>{formatTJM(mission.tjm)}</Field>
      <Field label={fr.missions.startDate}>
        {formatDate(mission.startDate)}
      </Field>
      <Field label={fr.missions.endDate}>{formatDate(mission.endDate)}</Field>
      <Field label={fr.missions.assignmentCount}>
        <span className="tabular-nums">{mission._activeAssignmentCount}</span>
      </Field>
      <Field label={fr.missions.requiredSkills}>
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
      </Field>
      <Field label={fr.missions.description} full>
        <span className="whitespace-pre-wrap">
          {mission.description ?? "—"}
        </span>
      </Field>
    </dl>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}
