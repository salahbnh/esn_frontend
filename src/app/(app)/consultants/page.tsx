import type { Metadata } from "next";

import { fr } from "@/lib/i18n/fr";
import { ConsultantsListView } from "@/features/consultants/pages/consultants-list";

export const metadata: Metadata = {
  title: fr.consultants.title,
};

/** Consultants directory. The list view is a client component (filters + query). */
export default function ConsultantsPage() {
  return <ConsultantsListView />;
}
