import type { Metadata } from "next";

import { fr } from "@/lib/i18n/fr";
import { CandidatesListView } from "@/features/recruitment/pages/candidates-list";

export const metadata: Metadata = {
  title: fr.candidates.title,
};

/** Candidates list. The list view is a client component (filters + query). */
export default function CandidatesPage() {
  return <CandidatesListView />;
}
