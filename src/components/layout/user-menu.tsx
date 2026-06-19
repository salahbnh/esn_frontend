"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fr } from "@/lib/i18n/fr";
import { roleLabel } from "@/lib/format";
import type { Role } from "@/lib/types";

function initials(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.split("@")[0] || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

/** Avatar dropdown: name + role badge + sign-out. */
export function UserMenu({
  name,
  email,
  role,
}: {
  name?: string | null;
  email?: string | null;
  role?: Role | null;
}) {
  const displayName = name || email || "Utilisateur";

  // Radix generates `useId`-based ids for the dropdown. Rendering it on the
  // server produced ids that didn't line up on the client (hydration mismatch),
  // so we render an identical plain trigger until mounted, then upgrade to the
  // interactive dropdown — its ids are then generated client-side only.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /**
   * Federated logout: fetch the Keycloak end-session URL while the session is
   * still valid, clear the local NextAuth cookie, then redirect to Keycloak to
   * end its SSO session (so the next login shows the login form / lets you
   * switch users). Falls back to a plain signOut if anything goes wrong.
   */
  async function handleSignOut() {
    try {
      const res = await fetch("/api/auth/keycloak-logout");
      const { url } = (await res.json()) as { url: string };
      await signOut({ redirect: false });
      window.location.href = url;
    } catch {
      await signOut({ callbackUrl: "/login" });
    }
  }

  const trigger = (
    <Button variant="ghost" className="h-9 gap-2 px-2" aria-label={displayName}>
      <Avatar className="h-7 w-7">
        <AvatarFallback className="text-xs">
          {initials(name, email)}
        </AvatarFallback>
      </Avatar>
      <span className="hidden text-sm font-medium sm:inline">{displayName}</span>
    </Button>
  );

  // SSR + first client render: identical static trigger (no Radix ids).
  if (!mounted) return trigger;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1.5">
          <span className="truncate">{displayName}</span>
          {role ? (
            <Badge variant="secondary" className="w-fit font-normal">
              {roleLabel(role)}
            </Badge>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {fr.auth.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
