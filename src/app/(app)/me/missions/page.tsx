import type { Metadata } from "next";

import { fr } from "@/lib/i18n/fr";
import { MeMissionsView } from "@/features/consultants/pages/me-missions";

export const metadata: Metadata = {
  title: fr.consultants.myMissionsTitle,
};

/** Consultant's own assignments (CONSULTANT only — gated by the me/ layout). */
export default function MeMissionsPage() {
  return <MeMissionsView />;
}
