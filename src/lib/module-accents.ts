/**
 * Per-module accent tints — the visual identity of each domain area, used
 * lightly (icon chips, page headers, active nav, stat cards) so the dashboard
 * feels alive without turning into a rainbow. Every entry ships light + dark
 * variants as LITERAL class strings (Tailwind JIT needs literals, never build
 * class names dynamically).
 */

export type ModuleAccent =
  | "dashboard"
  | "candidates"
  | "consultants"
  | "clients"
  | "missions"
  | "staffing"
  | "contracts"
  | "documents"
  | "skills"
  | "jobPosts"
  | "reports"
  | "users"
  | "me";

export interface AccentClasses {
  /** Icon chip: soft tinted square behind a lucide icon. */
  chip: string;
  /** Accent text (icons, emphasis). */
  text: string;
  /** Soft tinted surface (active nav, highlighted rows). */
  soft: string;
  /** Small dot / indicator bar. */
  bar: string;
}

export const MODULE_ACCENTS: Record<ModuleAccent, AccentClasses> = {
  dashboard: {
    chip: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
    text: "text-indigo-600 dark:text-indigo-300",
    soft: "bg-indigo-500/10 dark:bg-indigo-400/10",
    bar: "bg-indigo-500 dark:bg-indigo-400",
  },
  candidates: {
    chip: "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
    text: "text-violet-600 dark:text-violet-300",
    soft: "bg-violet-500/10 dark:bg-violet-400/10",
    bar: "bg-violet-500 dark:bg-violet-400",
  },
  consultants: {
    chip: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300",
    text: "text-sky-600 dark:text-sky-300",
    soft: "bg-sky-500/10 dark:bg-sky-400/10",
    bar: "bg-sky-500 dark:bg-sky-400",
  },
  clients: {
    chip: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300",
    text: "text-cyan-600 dark:text-cyan-300",
    soft: "bg-cyan-500/10 dark:bg-cyan-400/10",
    bar: "bg-cyan-500 dark:bg-cyan-400",
  },
  missions: {
    chip: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
    text: "text-amber-600 dark:text-amber-300",
    soft: "bg-amber-500/10 dark:bg-amber-400/10",
    bar: "bg-amber-500 dark:bg-amber-400",
  },
  staffing: {
    chip: "bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300",
    text: "text-teal-600 dark:text-teal-300",
    soft: "bg-teal-500/10 dark:bg-teal-400/10",
    bar: "bg-teal-500 dark:bg-teal-400",
  },
  contracts: {
    chip: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300",
    text: "text-blue-600 dark:text-blue-300",
    soft: "bg-blue-500/10 dark:bg-blue-400/10",
    bar: "bg-blue-500 dark:bg-blue-400",
  },
  documents: {
    chip: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
    text: "text-rose-600 dark:text-rose-300",
    soft: "bg-rose-500/10 dark:bg-rose-400/10",
    bar: "bg-rose-500 dark:bg-rose-400",
  },
  skills: {
    chip: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
    text: "text-emerald-600 dark:text-emerald-300",
    soft: "bg-emerald-500/10 dark:bg-emerald-400/10",
    bar: "bg-emerald-500 dark:bg-emerald-400",
  },
  jobPosts: {
    chip: "bg-orange-500/10 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300",
    text: "text-orange-600 dark:text-orange-300",
    soft: "bg-orange-500/10 dark:bg-orange-400/10",
    bar: "bg-orange-500 dark:bg-orange-400",
  },
  reports: {
    chip: "bg-fuchsia-500/10 text-fuchsia-600 dark:bg-fuchsia-400/10 dark:text-fuchsia-300",
    text: "text-fuchsia-600 dark:text-fuchsia-300",
    soft: "bg-fuchsia-500/10 dark:bg-fuchsia-400/10",
    bar: "bg-fuchsia-500 dark:bg-fuchsia-400",
  },
  users: {
    chip: "bg-pink-500/10 text-pink-600 dark:bg-pink-400/10 dark:text-pink-300",
    text: "text-pink-600 dark:text-pink-300",
    soft: "bg-pink-500/10 dark:bg-pink-400/10",
    bar: "bg-pink-500 dark:bg-pink-400",
  },
  me: {
    chip: "bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300",
    text: "text-teal-600 dark:text-teal-300",
    soft: "bg-teal-500/10 dark:bg-teal-400/10",
    bar: "bg-teal-500 dark:bg-teal-400",
  },
};
