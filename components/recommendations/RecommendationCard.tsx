import { ArrowUpRight } from "lucide-react";
import type { Recommendation } from "@/types";
import { formatCompactINR } from "@/utils/format";
import { ProgressBar } from "@/components/common/ProgressBar";
import { RiskBadge, ROIBadge } from "@/components/common/RiskBadge";
import { SaveButton } from "@/components/deals/SaveButton";
import Link from "next/link";
function scoreTone(score: number): string {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-brand-600 dark:text-brand-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function MatchBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold dark:bg-slate-800">
      <span className={scoreTone(score)}>{score}%</span>
      <span className="text-slate-500 dark:text-slate-400">match</span>
    </span>
  );
}

export function MatchBreakdown({ recommendation }: { recommendation: Recommendation }) {
  const { breakdown } = recommendation;
  const rows = [
    { label: "Risk match", value: breakdown.risk },
    { label: "Industry match", value: breakdown.industry },
    { label: "Budget match", value: breakdown.budget },
    { label: "ROI attractiveness", value: breakdown.roi },
  ];
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs text-slate-500 dark:text-slate-400">
            {row.label}
          </span>
          <ProgressBar value={row.value} className="flex-1" />
          <span className="w-8 text-right text-xs font-semibold text-slate-700 dark:text-slate-200">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RecommendationCard({
  recommendation,
  index = 0,
}: {
  recommendation: Recommendation;
  index?: number;
}) {
  const { deal, score } = recommendation;
  return (
    <article
      className="animate-slide-up flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
      style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">
            {deal.companyName}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {deal.industry} · {deal.location}
          </p>
        </div>
        <MatchBadge score={score} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <ROIBadge roi={deal.expectedROI} />
        <RiskBadge level={deal.riskLevel} />
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
        <MatchBreakdown recommendation={recommendation} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          Min. {formatCompactINR(deal.minimumInvestment)}
        </span>
        <div className="flex items-center gap-2">
          <SaveButton dealId={deal.id} size="sm" />
          <Link
            href={`/deals/${deal.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-700"
          >
            View <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

