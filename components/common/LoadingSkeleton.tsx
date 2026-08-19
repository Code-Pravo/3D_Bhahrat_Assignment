export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`}
    />
  );
}

/** Skeleton layout for a list of cards. */
export function LoadingSkeleton({
  variant = "card",
  count = 4,
}: {
  variant?: "card" | "table" | "chart" | "metric";
  count?: number;
}) {
  if (variant === "card" || variant === "metric") {
    return (
      <div className="grid gap-4" role="status" aria-label="Loading content">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="animate-slide-up rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="mt-3 h-8 w-2/3" />
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "chart") {
    return (
      <div
        className="flex h-full min-h-[260px] items-center justify-center rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        role="status"
        aria-label="Loading chart"
      >
        <Skeleton className="h-full max-h-[260px] w-full" />
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" role="status">
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="ml-auto h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}