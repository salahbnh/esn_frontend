"use client";

import { Briefcase, Building2, Layers, Mail, User } from "lucide-react";
import { InfoField, InfoGrid } from "@/components/common/info-grid";

import { PageHeader } from "@/components/common/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { fr } from "@/lib/i18n/fr";
import { ClientFormDialog } from "@/features/clients/components/client-form-dialog";
import { DocumentsPanel } from "@/features/documents/components/documents-panel";
import { QueryBoundary } from "@/features/clients/query-boundary";
import { useClient } from "@/features/clients/use-clients";

export function ClientDetailView({ id }: { id: string }) {
  const query = useClient(id);

  return (
    <QueryBoundary query={query}>
      {(client) => (
        <section className="space-y-6">
          <PageHeader icon={Building2} accent="clients"
            title={client.name}
            subtitle={client.industry ?? undefined}
            actions={<ClientFormDialog client={client} />}
          />

          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">{fr.clients.tabInfo}</TabsTrigger>
              <TabsTrigger value="documents">{fr.documents.title}</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <InfoGrid>
                <InfoField label={fr.clients.industry} icon={Layers}>
                  {client.industry ?? "—"}
                </InfoField>
                <InfoField label={fr.clients.missionCount} icon={Briefcase}>
                  <span className="tabular-nums">{client._missionCount}</span>
                </InfoField>
                <InfoField label={fr.clients.contactName} icon={User}>
                  {client.contactName ?? "—"}
                </InfoField>
                <InfoField label={fr.clients.contactEmail} icon={Mail}>
                  {client.contactEmail ?? "—"}
                </InfoField>
              </InfoGrid>
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsPanel entityType="CLIENT" entityId={id} />
            </TabsContent>
          </Tabs>
        </section>
      )}
    </QueryBoundary>
  );
}

