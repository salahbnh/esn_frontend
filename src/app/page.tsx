import { Card } from "@/components/ui/Card";

/**
 * Placeholder dashboard (Server Component). Describes the five functional
 * modules. Real KPIs/widgets land once the modules are built.
 */

interface ModuleInfo {
  name: string;
  description: string;
}

const MODULES: ModuleInfo[] = [
  {
    name: "1 · Recruitment (ATS)",
    description:
      "Candidate pipeline application → interview → validation, evaluations, proposals, and conversion to consultant.",
  },
  {
    name: "2 · Consultants",
    description:
      "Centralized consultant files (CV, skills, position) with status tracking: intercontract / on mission / available.",
  },
  {
    name: "3 · Staffing / Affectation",
    description:
      "Consultant ↔ mission matching, availability and planning, occupancy-rate (TJM, allocation) tracking.",
  },
  {
    name: "4 · Missions",
    description:
      "Create missions (client, role, dates, TJM, skills), assign consultants, track status/history, amendments and KPIs.",
  },
  {
    name: "5 · Work contracts",
    description:
      "Create from templates, internal validation RH → Manager → Direction, generate/sign PDF, centralized archive.",
  },
  {
    name: "6 · Reporting & pilotage",
    description:
      "Occupancy rate, recruitment pipeline, active/forecast missions, HR KPIs, consolidated direction view.",
  },
];

export default function DashboardPage() {
  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Internal ESN resource-management. This is a foundation skeleton — the
          module screens below are placeholders.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        }}
      >
        {MODULES.map((m) => (
          <Card key={m.name} title={m.name}>
            {m.description}
          </Card>
        ))}
      </div>
    </section>
  );
}
