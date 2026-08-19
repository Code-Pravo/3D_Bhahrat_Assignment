export function ProgressBar({
  value,
  className = "",
  toneClass = "bg-brand-600",
}: {
  value: number;
  className?: string;
  toneClass?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Funding progress"
      className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${toneClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
