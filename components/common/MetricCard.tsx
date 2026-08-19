import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

export interface MetricCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: number;
  trendSuffix?: string;
  hint?: string;
  loading?: boolean;
}

export function MetricCard({
  label,
  value,
  icon,
  trend,
  trendSuffix = "%",
  hint,
  loading = false,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            {icon}
          </span>
        )}
      </div>
      {loading ? (
        <div className="mt-2 h-7 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      ) : (
        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {value}
        </p>
      )}
      <div className="mt-1 flex items-center gap-2">
        {typeof trend === "number" && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              trend >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" aria-hidden />
            )}
            {Math.abs(trend).toFixed(1)}
            {trendSuffix}
          </span>
        )}
        {hint && <span className="text-xs text-slate-500 dark:text-slate-400">{hint}</span>}
      </div>
    </div>
  );
}