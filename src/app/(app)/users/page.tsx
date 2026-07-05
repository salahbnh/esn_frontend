import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { authOptions } from "@/lib/auth";
import { fr } from "@/lib/i18n/fr";
import { UsersAdminView } from "@/features/users/pages/users-admin";

export const metadata: Metadata = { title: fr.users.title };

/**
 * Users admin (DIRECTION only — UX gate; the API enforces it regardless).
 * Staff-account creation with Keycloak provisioning, deactivation, invites.
 */
export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? null;
  if (role !== "DIRECTION") redirect("/dashboard");
  return <UsersAdminView />;
}
