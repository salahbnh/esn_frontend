import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  Briefcase,
  Building2,
  ScrollText,
  Users,
  UsersRound,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { authOptions } from "@/lib/auth";
import { fr } from "@/lib/i18n/fr";

export const metadata: Metadata = {
  title: fr.documents.title,
};

const LINKS = [
  { href: "/consultants", label: fr.nav.consultants, icon: UsersRound },
  { href: "/contracts", label: fr.nav.contracts, icon: ScrollText },
  { href: "/missions", label: fr.nav.missions, icon: Briefcase },
  { href: "/candidates", label: fr.nav.candidates, icon: Users },
  { href: "/clients", label: fr.nav.clients, icon: Building2 },
] as const;

/**
 * Documents hub (RH / DIRECTION). There is no global documents list endpoint —
 * documents live on their owning entity — so this is a navigational hub linking
 * to the areas where each entity's Documents tab lives.
 */
export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;

  if (role !== "RH" && role !== "DIRECTION") {
    redirect("/dashboard");
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title={fr.documents.title}
        subtitle={fr.documents.hubSubtitle}
      />

      <p className="max-w-2xl text-sm text-muted-foreground">
        {fr.documents.hubIntro}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{l.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
