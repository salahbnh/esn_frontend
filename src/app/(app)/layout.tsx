import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { authOptions } from "@/lib/auth";

/**
 * Authenticated app shell: sidebar + topbar around the routed page. Reads the
 * session server-side; redirects to /login if absent (defence-in-depth on top
 * of middleware). Role drives the nav (UX only — backend stays authoritative).
 */
export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = session.user?.role ?? null;

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          name={session.user?.name}
          email={session.user?.email}
          role={role}
        />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
