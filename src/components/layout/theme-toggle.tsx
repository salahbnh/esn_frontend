"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { fr } from "@/lib/i18n/fr";

/** Light/dark toggle. Renders a stable placeholder until mounted (avoids hydration mismatch). */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  // Until mounted, the theme is unknown on the server — render a stable,
  // theme-independent label so the SSR and first client render match.
  const label = !mounted ? fr.theme.toggle : isDark ? fr.theme.light : fr.theme.dark;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={fr.theme.toggle}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
