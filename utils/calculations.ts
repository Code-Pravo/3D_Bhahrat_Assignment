import type { Deal, InvestmentRecord, PortfolioHolding, RiskLevel } from "@/types";
import { formatMonth } from "./format";

export interface TrendPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface IndustrySlice {
  name: string;
  value: number;
}

/**
 * Builds a bucketed monthly time-series (last `months` months) from a list of
 * dated records. `valueFor` extracts the numeric value for each record.
 */
export function monthlySeries<T extends { date: string }>(
  records: T[],
  months: number,
  valueFor: (r: T) => number,
  cumulative = false,
): TrendPoint[] {
  const now = new Date();
  const buckets: TrendPoint[] = [];
  let running = 0;

  for (let i = months - 1; i >= 0; i -= 1) {
    const cursor = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59);
    const monthRecords = records.filter((r) => {
      const d = new Date(r.date);
      return d >= cursor && d <= end;
    });
    const sum = monthRecords.reduce((acc, r) => acc + valueFor(r), 0);
    running += sum;
    buckets.push({ label: formatMonth(cursor.toISOString()), value: cumulative ? running : sum });
  }
  return buckets;
}

/** Distribution of invested amounts (or count) across industries. */
export function industryDistribution(deals: Deal[], dealIds: string[]): IndustrySlice[] {
  const byIndustry = new Map<string, number>();
  for (const id of dealIds) {
    const deal = deals.find((d) => d.id === id);
    if (!deal) continue;
    byIndustry.set(deal.industry, (byIndustry.get(deal.industry) ?? 0) + 1);
  }
  return [...byIndustry.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/** Aggregated portfolio statistics for the investor dashboard. */
export function portfolioStats(
  holdings: InvestmentRecord[],
  deals: Record<string, Deal>,
): {
  totalInvested: number;
  activeDeals: number;
  avgROI: number;
  riskDistribution: { level: RiskLevel; count: number }[];
  industries: IndustrySlice[];
} {
  const totalInvested = holdings.reduce((acc, h) => acc + h.amount, 0);
  const activeDeals = holdings.filter((h) => {
    const deal = deals[h.dealId];
    return deal && deal.dealStatus !== "Closed";
  }).length;

  const rois = holdings
    .map((h) => deals[h.dealId]?.expectedROI)
    .filter((v): v is number => typeof v === "number");
  const avgROI = rois.length ? rois.reduce((a, b) => a + b, 0) / rois.length : 0;

  const riskCount = new Map<RiskLevel, number>();
  for (const h of holdings) {
    const level = deals[h.dealId]?.riskLevel;
    if (level) riskCount.set(level, (riskCount.get(level) ?? 0) + 1);
  }
  const riskDistribution = [...riskCount.entries()]
    .map(([level, count]) => ({ level, count }))
    .sort((a, b) => a.level.localeCompare(b.level));

  const industries = industryDistribution(
    holdings.map((h) => deals[h.dealId]).filter((d): d is Deal => Boolean(d)),
    holdings.map((h) => h.dealId),
  );

  return { totalInvested, activeDeals, avgROI, riskDistribution, industries };
}

/** Corporate: monthly funding (sought + already funded) trend. */
export function fundingTrends(deals: Deal[], months: number): TrendPoint[] {
  return monthlySeries(deals, months, (d) => d.investmentRequired * (d.fundingProgress / 100));
}

/** Corporate: cumulative investor count growth by deal creation month. */
export function investorGrowth(deals: Deal[], months: number): TrendPoint[] {
  return monthlySeries(deals, months, (d) => d.investorCount, true);
}

/** Corporate: average funding conversion by month. */
export function conversionTrends(deals: Deal[], months: number): TrendPoint[] {
  const buckets = monthlySeries(deals, months, (d) => d.fundingProgress);
  return buckets.map((b) => ({ ...b, value: Math.round(b.value * 10) / 10 }));
}

/** Corporate: total funding sought grouped by industry. */
export function industryFunding(deals: Deal[]): IndustrySlice[] {
  const byIndustry = new Map<string, number>();
  for (const deal of deals) {
    byIndustry.set(deal.industry, (byIndustry.get(deal.industry) ?? 0) + deal.investmentRequired);
  }
  return [...byIndustry.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/** Cumulative invested amount series (used for the investment growth chart). */
export function investmentGrowthSeries(records: InvestmentRecord[], months: number): TrendPoint[] {
  return monthlySeries(records, months, (r) => r.amount, true);
}

export function sumBy<T>(items: T[], valueFor: (t: T) => number): number {
  return items.reduce((acc, t) => acc + valueFor(t), 0);
}

export function numberFromHoldings(holdings: PortfolioHolding[]): InvestmentRecord[] {
  return holdings as unknown as InvestmentRecord[];
}
