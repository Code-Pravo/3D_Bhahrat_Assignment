import Link from "next/link";
import { CalendarDays, Trash2 } from "lucide-react";
import type { Deal, InvestmentRecord } from "@/types";
import { formatCompactINR, formatDate } from "@/utils/format";
import { RiskBadge, ROIBadge } from "@/components/common/RiskBadge";
import { Badge } from "@/components/common/Badge";

export function InvestmentCard({
  investment,
  deal,
  onRemove,
}: {
  investment: InvestmentRecord;
  deal?: Deal;
  onRemove: (dealId: string) => void;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">
            {deal?.companyName ?? investment.dealId}
          </h3>
          <Badge tone="brand">Invested</Badge>
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            {formatDate(investment.date)}
          </span>
          {deal && (
            <span>
              {deal.industry} · {deal.location}
            </span>
          )}
        </p>
        {deal && (
          <div className="mt-2 flex flex-wrap gap-2">
            <ROIBadge roi={deal.expectedROI} />
            <RiskBadge level={deal.riskLevel} />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
            {formatCompactINR(investment.amount)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {deal ? `Projected ${formatCompactINR(Math.round(investment.amount * Math.pow(1 + deal.expectedROI / 100, Math.max(1, deal.duration) / 12)))}` : "Allocated"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {deal && (
            <Link
              href={`/deals/${deal.id}`}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              View deal
            </Link>
          )}
          <button
            onClick={() => onRemove(investment.dealId)}
            aria-label={`Remove investment in ${deal?.companyName ?? "deal"}`}
            className="rounded-lg border border-slate-300 p-1.5 text-slate-400 transition-colors hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:hover:border-red-700 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
