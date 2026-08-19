"use client";

import { useEffect, useState } from "react";
import { Filter, RotateCcw } from "lucide-react";
import type { DealFilters, DealStatus, RiskLevel } from "@/types";
import { DEAL_STATUSES, RISK_LEVELS } from "@/utils/constants";
import { emptyFilters, hasActiveFilters } from "@/utils/filters";
import { Button } from "@/components/common/Button";

function toNumber(value: string): number | null {
  const parsed = Number(value);
  return value.trim() === "" || Number.isNaN(parsed) ? null : parsed;
}

export function FilterPanel({
  filters,
  onChange,
  industries,
}: {
  filters: DealFilters;
  onChange: (filters: DealFilters) => void;
  industries: string[];
}) {
  const [roiMin, setRoiMin] = useState(filters.roiMin?.toString() ?? "");
  const [roiMax, setRoiMax] = useState(filters.roiMax?.toString() ?? "");
  const [invMin, setInvMin] = useState(filters.investmentMin?.toString() ?? "");
  const [invMax, setInvMax] = useState(filters.investmentMax?.toString() ?? "");

  // Keep local numeric inputs in sync when filters change externally.
  useEffect(() => {
    setRoiMin(filters.roiMin?.toString() ?? "");
    setRoiMax(filters.roiMax?.toString() ?? "");
    setInvMin(filters.investmentMin?.toString() ?? "");
    setInvMax(filters.investmentMax?.toString() ?? "");
  }, [filters.roiMin, filters.roiMax, filters.investmentMin, filters.investmentMax]);

  const toggleRisk = (level: RiskLevel) => {
    const next = filters.riskLevels.includes(level)
      ? filters.riskLevels.filter((r) => r !== level)
      : [...filters.riskLevels, level];
    onChange({ ...filters, riskLevels: next });
  };

  const toggleIndustry = (industry: string) => {
    const next = filters.industries.includes(industry)
      ? filters.industries.filter((i) => i !== industry)
      : [...filters.industries, industry];
    onChange({ ...filters, industries: next });
  };

  const toggleStatus = (status: DealStatus) => {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onChange({ ...filters, statuses: next });
  };

  const clearAll = () => {
    setRoiMin("");
    setRoiMax("");
    setInvMin("");
    setInvMax("");
    onChange(emptyFilters());
  };

  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
      active
        ? "border-brand-600 bg-brand-600 text-white"
        : "border-slate-300 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:text-brand-300"
    }`;

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

  return (
    <section
      aria-label="Deal filters"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          <Filter className="h-4 w-4 text-brand-600" aria-hidden />
          Filters
        </h2>
        {hasActiveFilters(filters) && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset
          </Button>
        )}
      </div>


      {/* ROI range */}
      <fieldset className="mb-5">
        <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Expected ROI (%)
        </legend>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="roi-min">Minimum ROI</label>
          <input
            id="roi-min"
            type="number"
            min={0}
            placeholder="Min"
            value={roiMin}
            onChange={(e) => setRoiMin(e.target.value)}
            onBlur={() => onChange({ ...filters, roiMin: toNumber(roiMin) })}
            className={inputClass}
          />
          <span className="text-slate-400">–</span>
          <label className="sr-only" htmlFor="roi-max">Maximum ROI</label>
          <input
            id="roi-max"
            type="number"
            min={0}
            placeholder="Max"
            value={roiMax}
            onChange={(e) => setRoiMax(e.target.value)}
            onBlur={() => onChange({ ...filters, roiMax: toNumber(roiMax) })}
            className={inputClass}
          />
        </div>
      </fieldset>

      {/* Investment range */}
      <fieldset className="mb-5">
        <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Investment required (₹)
        </legend>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="inv-min">Minimum investment</label>
          <input
            id="inv-min"
            type="number"
            min={0}
            placeholder="Min"
            value={invMin}
            onChange={(e) => setInvMin(e.target.value)}
            onBlur={() => onChange({ ...filters, investmentMin: toNumber(invMin) })}
            className={inputClass}
          />
          <span className="text-slate-400">–</span>
          <label className="sr-only" htmlFor="inv-max">Maximum investment</label>
          <input
            id="inv-max"
            type="number"
            min={0}
            placeholder="Max"
            value={invMax}
            onChange={(e) => setInvMax(e.target.value)}
            onBlur={() => onChange({ ...filters, investmentMax: toNumber(invMax) })}
            className={inputClass}
          />
        </div>
      </fieldset>

      {/* Risk level */}
      <fieldset className="mb-5">
        <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Risk level
        </legend>
        <div className="flex flex-wrap gap-2">
          {RISK_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => toggleRisk(level)}
              aria-pressed={filters.riskLevels.includes(level)}
              className={chipClass(filters.riskLevels.includes(level))}
            >
              {level}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Industry */}
      <fieldset className="mb-5">
        <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Industry
        </legend>
        <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => toggleIndustry(industry)}
              aria-pressed={filters.industries.includes(industry)}
              className={chipClass(filters.industries.includes(industry))}
            >
              {industry}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Deal status */}
      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Deal status
        </legend>
        <div className="space-y-2">
          {DEAL_STATUSES.map((status) => (
            <label
              key={status}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300"
            >
              <input
                type="checkbox"
                checked={filters.statuses.includes(status)}
                onChange={() => toggleStatus(status)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
              />
              {status}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
