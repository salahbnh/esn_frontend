import Link from "next/link";

import { AuthButton } from "@/components/AuthButton";

/** Placeholder navigation — real per-module links land as modules are built. */
const NAV_PLACEHOLDER = [
  "Recruitment",
  "Consultants",
  "Staffing",
  "Missions",
  "Contracts",
] as const;

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          ESN <span className="text-slate-400">Resource Manager</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex" aria-label="Modules">
          {NAV_PLACEHOLDER.map((item) => (
            <span
              key={item}
              className="cursor-default text-sm text-slate-400"
              title="Coming soon"
            >
              {item}
            </span>
          ))}
        </nav>

        <AuthButton />
      </div>
    </header>
  );
}
