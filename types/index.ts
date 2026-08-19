// ---------------------------------------------------------------------
// Core domain types for the 3D Bharat platform.
// ---------------------------------------------------------------------

export type RiskLevel = "Low" | "Moderate" | "High" | "Very High";

export type DealStatus = "Open" | "Closed" | "Coming Soon" | "Active";

export type SortOption =
  | "roi"
  | "investment"
  | "risk"
  | "funding"
  | "newest"
  | "match";

export interface Deal {
  id: string;
  companyName: string;
  industry: string;
  description: string;
  location: string;
  investmentRequired: number; // total funding sought (INR)
  minimumInvestment: number; // min ticket size (INR)
  maximumInvestment: number; // max ticket size (INR)
  expectedROI: number; // percent (annualized)
  riskLevel: RiskLevel;
  fundingProgress: number; // 0 - 100
  investorCount: number;
  revenue: number; // annualized (INR)
  profit: number; // annualized (INR)
  growthRate: number; // percent
  foundedYear: number;
  dealStatus: DealStatus;
  duration: number; // months
  createdAt: string; // ISO date
}

export interface PortfolioHolding {
  dealId: string;
  amount: number;
  date: string; // ISO date
}

export interface Investor {
  id: string;
  name: string;
  email: string;
  budget: number;
  preferredIndustries: string[];
  riskPreference: RiskLevel;
  expectedROI: number;
  portfolio: PortfolioHolding[];
  interests: string[]; // saved deal ids
}

export interface DealFilters {
  roiMin: number | null;
  roiMax: number | null;
  riskLevels: RiskLevel[];
  industries: string[];
  investmentMin: number | null;
  investmentMax: number | null;
  statuses: DealStatus[];
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface MatchBreakdown {
  risk: number;
  industry: number;
  budget: number;
  roi: number;
}

export interface Recommendation {
  deal: Deal;
  score: number;
  breakdown: MatchBreakdown;
}

export interface InvestmentRecord {
  dealId: string;
  amount: number;
  date: string; // ISO date
  name?: string;
  expectedROI?: number;
  riskLevel?: RiskLevel;
  industry?: string;
}

export type ThemeMode = "light" | "dark";
