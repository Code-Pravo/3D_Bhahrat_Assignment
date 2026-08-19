"use client";

import { useAppSelector } from "@/store";

/** Consistent categorical color palette used across all charts. */
export const PALETTE = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#0ea5e9",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#ec4899",
  "#84cc16",
];

/** Reactive chart theming based on the active light/dark mode. */
export function useChartTheme() {
  const dark = useAppSelector((state) => state.ui.theme) === "dark";
  return {
    dark,
    grid: dark ? "#1e293b" : "#e2e8f0",
    axis: dark ? "#94a3b8" : "#64748b",
    tooltipBg: dark ? "#0f172a" : "#ffffff",
    tooltipBorder: dark ? "#334155" : "#e2e8f0",
    tooltipText: dark ? "#e2e8f0" : "#1e293b",
  };
}

// Recharts injects a flexible payload; we type the incoming props loosely.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChartTooltip({ active, payload, label, formatter }: any) {
  const theme = useChartTheme();
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{
        background: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        color: theme.tooltipText,
      }}
    >
      {label != null && label !== "" && (
        <p className="mb-1 font-semibold">{label}</p>
      )}
      {payload.map((entry: { name?: string; value: number; color?: string }, i: number) => (
        <p key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: entry.color ?? PALETTE[i % PALETTE.length] }}
          />
          {entry.name}:
          <span className="font-semibold">
            {formatter ? formatter(entry.value) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}
