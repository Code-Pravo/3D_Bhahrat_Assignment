import type { Deal, DealFilters, PaginatedResult, SortOption } from "@/types";
import dealsData from "@/data/deals.json";
import { applyFilters, distinctIndustries, paginate, sortDeals } from "@/utils/filters";
import { notFound, simulate } from "./mock";

// The JSON dataset is loaded once at module scope and treated as the
// "database". Every function simulates an asynchronous API round-trip.
const DATASET: Deal[] = dealsData as Deal[];

export interface DealQuery {
  page?: number;
  pageSize?: number;
  query?: string;
  filters?: DealFilters;
  sortBy?: SortOption;
}

/**
 * Returns the full deal catalogue. Used as a low-level primitive; most callers
 * should prefer the paginated endpoint.
 */
export function getDeals(): Promise<Deal[]> {
  return simulate<Deal[]>(() => DATASET.map((d) => ({ ...d })));
}

/** Fetches a single deal by id; rejects with a 404-style error when missing. */
export function getDealById(id: string): Promise<Deal> {
  return simulate<Deal>(() => {
    const deal = DATASET.find((d) => d.id === id);
    if (!deal) throw notFound("deal", id);
    return { ...deal };
  });
}

/** Searches deals by company name, industry or location. */
export function searchDeals(query: string): Promise<Deal[]> {
  return simulate<Deal[]>(() =>
    applyFilters(DATASET, query, {
      roiMin: null,
      roiMax: null,
      riskLevels: [],
      industries: [],
      investmentMin: null,
      investmentMax: null,
      statuses: [],
    }).map((d) => ({ ...d })),
  );
}

/** Filters the catalogue by the provided filter object. */
export function filterDeals(filters: DealFilters): Promise<Deal[]> {
  return simulate<Deal[]>(() =>
    applyFilters(DATASET, "", filters).map((d) => ({ ...d })),
  );
}

/** Sorts a deal list by the given option. */
export function sortDealsBy(deals: Deal[], sortBy: SortOption): Promise<Deal[]> {
  return simulate<Deal[]>(() => sortDeals(deals, sortBy).map((d) => ({ ...d })));
}

/**
 * Search + filter + sort + paginate in one call, mirroring a real
 * `GET /deals?q=...&page=...` style endpoint.
 */
export function getDealsPaginated(query: DealQuery = {}): Promise<PaginatedResult<Deal>> {
  const { page = 1, pageSize = 8, query: q = "", filters, sortBy = "newest" } = query;
  return simulate<PaginatedResult<Deal>>(() => {
    const filtered = applyFilters(DATASET, q, filters ?? emptyDealFilters());
    const sorted = sortDeals(filtered, sortBy);
    return paginate(sorted, page, pageSize);
  });
}

/** Distinct industries present in the dataset. */
export function getIndustries(): Promise<string[]> {
  return simulate<string[]>(() => distinctIndustries(DATASET));
}

/** Distinct locations present in the dataset. */
export function getLocations(): Promise<string[]> {
  return simulate<string[]>(() => [...new Set(DATASET.map((d) => d.location))].sort());
}

export interface DealStatistics {
  total: number;
  open: number;
  totalFundingRequired: number;
  totalFundingRaised: number;
  averageROI: number;
  averageFundingProgress: number;
  totalInvestors: number;
}

/** Aggregate metrics used by dashboards. */
export function getDealStatistics(): Promise<DealStatistics> {
  return simulate<DealStatistics>(() => {
    const total = DATASET.length;
    const open = DATASET.filter((d) => d.dealStatus === "Open").length;
    const totalFundingRequired = DATASET.reduce((acc, d) => acc + d.investmentRequired, 0);
    const totalFundingRaised = DATASET.reduce(
      (acc, d) => acc + d.investmentRequired * (d.fundingProgress / 100),
      0,
    );
    const averageROI =
      DATASET.reduce((acc, d) => acc + d.expectedROI, 0) / Math.max(1, total);
    const averageFundingProgress =
      DATASET.reduce((acc, d) => acc + d.fundingProgress, 0) / Math.max(1, total);
    const totalInvestors = DATASET.reduce((acc, d) => acc + d.investorCount, 0);
    return {
      total,
      open,
      totalFundingRequired,
      totalFundingRaised,
      averageROI,
      averageFundingProgress,
      totalInvestors,
    };
  });
}

function emptyDealFilters(): DealFilters {
  return {
    roiMin: null,
    roiMax: null,
    riskLevels: [],
    industries: [],
    investmentMin: null,
    investmentMax: null,
    statuses: [],
  };
}
