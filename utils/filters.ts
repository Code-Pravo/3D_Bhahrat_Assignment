import type { Deal, DealFilters, PaginationMeta, PaginatedResult, SortOption } from "@/types";

const EMPTY_FILTERS: DealFilters = {
  roiMin: null,
  roiMax: null,
  riskLevels: [],
  industries: [],
  investmentMin: null,
  investmentMax: null,
  statuses: [],
};

export function emptyFilters(): DealFilters {
  return { ...EMPTY_FILTERS };
}

export function hasActiveFilters(filters: DealFilters): boolean {
  return (
    filters.roiMin !== null ||
    filters.roiMax !== null ||
    filters.riskLevels.length > 0 ||
    filters.industries.length > 0 ||
    filters.investmentMin !== null ||
    filters.investmentMax !== null ||
    filters.statuses.length > 0
  );
}

/** Case-insensitive search across company name, industry and location. */
function matchesQuery(deal: Deal, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    deal.companyName.toLowerCase().includes(q) ||
    deal.industry.toLowerCase().includes(q) ||
    deal.location.toLowerCase().includes(q)
  );
}

function matchesFilters(deal: Deal, filters: DealFilters): boolean {
  if (filters.roiMin !== null && deal.expectedROI < filters.roiMin) return false;
  if (filters.roiMax !== null && deal.expectedROI > filters.roiMax) return false;
  if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(deal.riskLevel)) return false;
  if (filters.industries.length > 0 && !filters.industries.includes(deal.industry)) return false;
  if (filters.investmentMin !== null && deal.investmentRequired < filters.investmentMin) return false;
  if (filters.investmentMax !== null && deal.investmentRequired > filters.investmentMax) return false;
  if (filters.statuses.length > 0 && !filters.statuses.includes(deal.dealStatus)) return false;
  return true;
}

const RISK_ORDER: Record<string, number> = { Low: 1, Moderate: 2, High: 3, "Very High": 4 };

/** Applies search + filters to a deal list. */
export function applyFilters(deals: Deal[], query: string, filters: DealFilters): Deal[] {
  return deals.filter((d) => matchesQuery(d, query) && matchesFilters(d, filters));
}

/** Stable sort by the requested option. */
export function sortDeals(deals: Deal[], sortBy: SortOption): Deal[] {
  const sorted = [...deals];
  switch (sortBy) {
    case "roi":
      sorted.sort((a, b) => b.expectedROI - a.expectedROI);
      break;
    case "investment":
      sorted.sort((a, b) => b.investmentRequired - a.investmentRequired);
      break;
    case "risk":
      sorted.sort((a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]);
      break;
    case "funding":
      sorted.sort((a, b) => b.fundingProgress - a.fundingProgress);
      break;
    case "newest":
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      break;
  }
  return sorted;
}

/** Slice a filtered list into a page. */
export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const itemsInPage = items.slice(start, start + pageSize);
  const meta: PaginationMeta = { page: safePage, pageSize, total, totalPages };
  return { items: itemsInPage, meta };
}

/** Collect the distinct industries present in a deal list. */
export function distinctIndustries(deals: Deal[]): string[] {
  return [...new Set(deals.map((d) => d.industry))].sort();
}
