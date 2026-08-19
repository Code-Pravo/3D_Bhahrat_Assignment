import type { RiskLevel } from "@/types";
import { RISK_COLORS, RISK_LEVELS } from "@/utils/constants";
import { DashboardCard } from "@/components/common/DashboardCard";
import { ShieldAlert } from "lucide-react";

export function RiskDistributionCard({
  distribution,
  loading = false,
}: {
  distribution: { level: RiskLevel; count: number }[];
  loading?: boolean;
}) {
  const total = distribution.reduce((acc, d) => acc + d.count, 0);

  return (
    <DashboardCard
      title="Risk Distribution"
      subtitle="Portfolio exposure by risk level"
      icon={<ShieldAlert className="h-4 w-4" aria-hidden />}
    >
      {loading ? (
        <div className="space-y-3">
          {RISK_LEVELS.map((_, i) => (
            <div key={i} className="h-5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      ) : distribution.length === 0 ? (
        <p className="text-sm text-slate-400">No holdings to analyse yet.</p>
      ) : (
        <div className="space-y-3.5">
          {RISK_LEVELS.map((level) => {
            const entry = distribution.find((d) => d.level === level);
            const count = entry?.count ?? 0;
            const pct = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={level}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{level}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {count} {count === 1 ? "deal" : "deals"} · {pct}%
                  </span>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: RISK_COLORS[level] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}