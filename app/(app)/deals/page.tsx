"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, SlidersHorizontal, Table as TableIcon } from "lucide-react";

import { useDeals } from "@/hooks/useDeals";
import { INDUSTRIES } from "@/utils/constants";
import { hasActiveFilters } from "@/utils/filters";
import { SearchBar } from "@/components/deals/SearchBar";
import { FilterPanel } from "@/components/deals/FilterPanel";
import { DealTable } from "@/components/deals/DealTable";
import { DealCard } from "@/components/deals/DealCard";
import { Pagination } from "@/components/deals/Pagination";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "roi", label: "Highest ROI" },
  { value: "investment", label: "Investment required" },
  { value: "risk", label: "Risk level" },
  { value: "funding", label: "Funding progress" },
];

export default function DealsPage() {
  const {
    items,
    meta,
    loading,
    error,
    query,
    filters,
    sortBy,
    updateQuery,
    updateFilters,
    updateSort,
    goToPage,
    retry,
  } = useDeals();

  const [view, setView] = useState<"table" | "grid">("table");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtersActive = useMemo(() => hasActiveFilters(filters), [filters]);
  const showingResults = meta.total > 0;

  const clearAllFilters = () =>
    updateFilters({
      roiMin: null,
      roiMax: null,
      riskLevels: [],
      industries: [],
      investmentMin: null,
      investmentMax: null,
      statuses: [],
    });

  return (
    <div className="space-y-5">
      {/* Page header + search */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Explore Deals</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Discover high-growth investment opportunities across India.
          </p>
        </div>
        <SearchBar onSearch={updateQuery} placeholder="Search by company, industry or location…" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          className="lg:hidden"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filters {filtersActive ? "•" : ""}
        </Button>

        <div className="ml-auto flex items-center gap-3">
          <Select
            label="Sort by"
            value={sortBy}
            onChange={(v) => updateSort(v as typeof sortBy)}
            options={SORT_OPTIONS}
            className="w-44"
            aria-label="Sort deals"
          />
          <div
            className="hidden rounded-lg border border-slate-300 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900 sm:flex"
            role="tablist"
            aria-label="View mode"
          >
            <button
              role="tab"
              aria-selected={view === "table"}
              onClick={() => setView("table")}
              className={`rounded-md p-2 ${view === "table" ? "bg-brand-600 text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"}`}
              aria-label="Table view"
            >
              <TableIcon className="h-4 w-4" aria-hidden />
            </button>
            <button
              role="tab"
              aria-selected={view === "grid"}
              onClick={() => setView("grid")}
              className={`rounded-md p-2 ${view === "grid" ? "bg-brand-600 text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"}`}
              aria-label="Card grid view"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        {/* Filters — always visible on desktop */}
        <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <FilterPanel filters={filters} onChange={updateFilters} industries={INDUSTRIES} />
        </div>

        {/* Results */}
        <div className="min-w-0 space-y-4 lg:col-span-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading
              ? "Loading deals…"
              : showingResults
                ? `${meta.total} deal${meta.total === 1 ? "" : "s"} found${query ? ` for “${query}”` : ""}`
                : "No deals match your criteria."}
          </p>

          {error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : loading ? (
            view === "table" ? (
              <LoadingSkeleton variant="table" count={6} />
            ) : (
              <LoadingSkeleton variant="card" count={6} />
            )
          ) : !showingResults ? (
            <EmptyState
              title="No deals found"
              description={
                query || filtersActive
                  ? "Try adjusting your search or clearing some filters."
                  : "There are no deals available right now."
              }
              action={
                query || filtersActive ? (
                  <Button variant="secondary" size="sm" onClick={clearAllFilters}>
                    Clear search & filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              {view === "table" && (
                <div className="hidden md:block">
                  <DealTable deals={items} />
                </div>
              )}
              <div className={view === "table" ? "md:hidden" : ""}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((deal, i) => (
                    <DealCard key={deal.id} deal={deal} index={i} />
                  ))}
                </div>
              </div>

              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                total={meta.total}
                pageSize={meta.pageSize}
                onPageChange={goToPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}