import { getServerSession } from "next-auth";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { roleLabel } from "@/lib/format";
import { fr } from "@/lib/i18n/fr";

export const metadata: Metadata = {
  title: fr.dashboard.title,
};

/**
 * Placeholder dashboard. Greets the user by name + shows their role, proving
 * the session + shell render end-to-end. Real KPIs land in Milestone 2.
 */
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name ?? session?.user?.email ?? "";
  const role = session?.user?.role ?? null;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {fr.dashboard.greeting}
          {name ? `, ${name}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">{fr.dashboard.placeholder}</p>
      </header>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{fr.dashboard.yourRole}</CardTitle>
          <CardDescription>{fr.dashboard.comingSoon}</CardDescription>
        </CardHeader>
        <CardContent>
          {role ? (
            <Badge variant="secondary" className="text-sm">
              {roleLabel(role)}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">
              {fr.common.empty}
            </span>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
