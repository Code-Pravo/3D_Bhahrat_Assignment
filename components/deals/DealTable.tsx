import Link from "next/link";
import type { Deal } from "@/types";
import { formatCompactINR } from "@/utils/format";
import { RiskBadge, ROIBadge } from "@/components/common/RiskBadge";
import { Badge } from "@/components/common/Badge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { SaveButton } from "./SaveButton";

export function DealTable({ deals }: { deals: Deal[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">ROI</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Funding</th>
              <th className="px-4 py-3 font-medium">Required</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {deals.map((deal) => (
              <tr
                key={deal.id}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/deals/${deal.id}`}
                    className="font-semibold text-slate-900 hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-400"
                  >
                    {deal.companyName}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {deal.location} · est. {deal.foundedYear}
                  </p>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{deal.industry}</td>
                <td className="px-4 py-3">
                  <ROIBadge roi={deal.expectedROI} />
                </td>
                <td className="px-4 py-3">
                  <RiskBadge level={deal.riskLevel} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex w-28 items-center gap-2">
                    <ProgressBar value={deal.fundingProgress} className="w-16" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {deal.fundingProgress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                  {formatCompactINR(deal.investmentRequired)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Badge tone={deal.dealStatus === "Open" ? "success" : "neutral"}>
                      {deal.dealStatus}
                    </Badge>
                    <SaveButton dealId={deal.id} size="sm" />
                    <Link
                      href={`/deals/${deal.id}`}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
