import type { Metadata } from "next";

import { fr } from "@/lib/i18n/fr";
import { MeContractView } from "@/features/contracts/pages/me-contract";

export const metadata: Metadata = {
  title: fr.contracts.myContractsTitle,
};

/** Consultant's own contracts — read + sign/reject (CONSULTANT only, gated by me/ layout). */
export default function MeContractPage() {
  return <MeContractView />;
}
