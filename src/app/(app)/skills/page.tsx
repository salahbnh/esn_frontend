import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { authOptions } from "@/lib/auth";
import { fr } from "@/lib/i18n/fr";
import { SkillsAdminView } from "@/features/skills/pages/skills-admin";

export const metadata: Metadata = {
  title: fr.skills.title,
};

/**
 * Skills referential management (RH / DIRECTION). Others are redirected to the
 * dashboard (UX gate — the write endpoints are RH/DIRECTION-only regardless).
 */
export default async function SkillsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;

  if (role !== "RH" && role !== "DIRECTION") {
    redirect("/dashboard");
  }

  return <SkillsAdminView />;
}
