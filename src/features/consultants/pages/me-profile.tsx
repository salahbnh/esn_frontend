"use client";

import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { fr } from "@/lib/i18n/fr";
import { ConsultantDocumentsList } from "@/features/consultants/components/consultant-documents-list";
import { ConsultantProfile } from "@/features/consultants/components/consultant-profile";
import { SelfEditDialog } from "@/features/consultants/components/self-edit-dialog";
import { QueryBoundary } from "@/features/consultants/query-boundary";
import { useOwnProfile } from "@/features/consultants/use-consultants";

/**
 * Consultant self-service profile. A 404 from `/consultants/me` (no consultant
 * profile linked to this account) renders a graceful empty state rather than an
 * error. No status-change control — consultants cannot change their own status.
 */
export function MeProfileView() {
  const query = useOwnProfile();

  return (
    <QueryBoundary
      query={query}
      notFound={{
        title: "Aucune fiche consultant",
        hint: "Votre compte n'est pas encore associé à une fiche consultant.",
      }}
    >
      {(consultant) => (
        <section className="space-y-6">
          <PageHeader
            title={fr.consultants.myProfileTitle}
            subtitle={fr.consultants.myProfileSubtitle}
            actions={
              <>
                <StatusBadge kind="consultant" value={consultant.status} />
                <SelfEditDialog consultant={consultant} />
              </>
            }
          />

          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">
                {fr.consultants.tabProfile}
              </TabsTrigger>
              <TabsTrigger value="documents">
                {fr.consultants.tabDocuments}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ConsultantProfile consultant={consultant} />
            </TabsContent>
            <TabsContent value="documents">
              <ConsultantDocumentsList consultantId={consultant.id} />
            </TabsContent>
          </Tabs>
        </section>
      )}
    </QueryBoundary>
  );
}
