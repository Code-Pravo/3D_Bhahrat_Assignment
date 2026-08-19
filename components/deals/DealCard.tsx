import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Deal } from "@/types";
import { formatCompactINR } from "@/utils/format";
import { RiskBadge, ROIBadge } from "@/components/common/RiskBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { Badge } from "@/components/common/Badge";
import { SaveButton } from "./SaveButton";

export function DealCard({ deal, index = 0 }: { deal: Deal; index?: number }) {
  return (
    <article
      className="animate-slide-up group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
      style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">
            {deal.companyName}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {deal.location} · {deal.industry}
          </p>
        </div>
        <SaveButton dealId={deal.id} size="sm" />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
        {deal.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ROIBadge roi={deal.expectedROI} />
        <RiskBadge level={deal.riskLevel} />
        <Badge tone={deal.dealStatus === "Open" ? "success" : "neutral"}>{deal.dealStatus}</Badge>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Minimum investment</span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {formatCompactINR(deal.minimumInvestment)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Funding goal</span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {formatCompactINR(deal.investmentRequired)}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Funding progress</span>
          <span className="font-semibold text-brand-600 dark:text-brand-400">
            {deal.fundingProgress}%
          </span>
        </div>
        <ProgressBar value={deal.fundingProgress} />
      </div>

      <Link
        href={`/deals/${deal.id}`}
        className="mt-5 inline-flex items-center gap-1 self-start rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        View details
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </Link>
    </article>
  );
}