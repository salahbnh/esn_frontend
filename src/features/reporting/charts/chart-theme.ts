/**
 * Shared Recharts styling helpers — all colors come from CSS theme vars so
 * charts adapt to light/dark automatically (SVG resolves `hsl(var(--…))`).
 */

export const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
] as const;

export function chartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length] ?? CHART_COLORS[0];
}

/** Tooltip props themed to the popover surface (FR number formatting). */
export const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.5rem",
    color: "hsl(var(--popover-foreground))",
    fontSize: "0.8125rem",
  },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
  // Item rows default to black in Recharts; force the themed foreground so the
  // value/description line stays readable in dark mode.
  itemStyle: { color: "hsl(var(--popover-foreground))" },
  cursor: { fill: "hsl(var(--muted))", opacity: 0.4 },
} as const;

export const axisStyle = {
  stroke: "hsl(var(--muted-foreground))",
  fontSize: 12,
} as const;

export const gridStroke = "hsl(var(--border))";

export const nfFr = new Intl.NumberFormat("fr-FR");

export function formatInt(value: number): string {
  return nfFr.format(value);
}

/**
 * Tooltip value formatter with the signature Recharts expects (value may be a
 * number, string, or array). Falls back gracefully for non-numeric values.
 */
export function tooltipIntFormatter(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? nfFr.format(n) : String(value ?? "");
}
