import type { Metadata } from "next";

import { fr } from "@/lib/i18n/fr";
import { ClientsListView } from "@/features/clients/pages/clients-list";

export const metadata: Metadata = {
  title: fr.clients.title,
};

/** Clients directory. The list view is a client component (search + query). */
export default function ClientsPage() {
  return <ClientsListView />;
}
