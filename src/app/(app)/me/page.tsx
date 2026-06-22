import type { Metadata } from "next";

import { fr } from "@/lib/i18n/fr";
import { MeProfileView } from "@/features/consultants/pages/me-profile";

export const metadata: Metadata = {
  title: fr.consultants.myProfileTitle,
};

/** Consultant self-service profile (CONSULTANT only — gated by the me/ layout). */
export default function MePage() {
  return <MeProfileView />;
}
