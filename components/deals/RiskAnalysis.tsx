import type { Deal } from "@/types";
import { RISK_COLORS } from "@/utils/constants";
import { ProgressBar } from "@/components/common/ProgressBar";
import { RiskBadge } from "@/components/common/RiskBadge";

/**
 * Visual risk assessment for a single deal. Each factor is scored 0-100 from
 * the deal's underlying metrics and rendered as a progress indicator.
 */
export function RiskAnalysis({ deal }: { deal: Deal }) {
  const age = new Date().getFullYear() - deal.foundedYear;

  const factors = [
    {
      label: "Operational maturity",
      value: Math.min(100, 30 + age * 10),
      note: `${deal.foundedYear} founding · ${age} yr track record`,
    },
    {
      label: "Profitability",
      value: deal.profit >= 0 ? Math.min(100, 55 + (deal.profit / Math.max(1, deal.revenue)) * 150) : 25,
      note: deal.profit >= 0 ? "Profitable operations" : "Pre-profit / burn phase",
    },
    {
      label: "Market traction",
      value: Math.min(100, 20 + deal.growthRate * 0.9),
      note: `${deal.growthRate}% YoY growth`,
    },
    {
      label: "Funding momentum",
      value: deal.fundingProgress,
      note: `${deal.investorCount} investors committed`,
    },
  ];

  const overall = Math.round(factors.reduce((acc, f) => acc + f.value, 0) / factors.length);
  const overallLabel = overall >= 70 ? "Healthy" : overall >= 45 ? "Moderate" : "Elevated";
  const color = RISK_COLORS[deal.riskLevel];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Overall risk assessment
          </p>
          <p className="mt-1 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-50">
            {overallLabel}
            <RiskBadge level={deal.riskLevel} />
          </p>
        </div>
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
          style={{ background: color }}
        >
          {overall}
        </span>
      </div>

      <div className="space-y-4">
        {factors.map((factor) => (
          <div key={factor.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-200">{factor.label}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{factor.note}</span>
            </div>
            <ProgressBar value={factor.value} toneClass="bg-brand-600" />
          </div>
        ))}
      </div>
    </div>
  );
}
