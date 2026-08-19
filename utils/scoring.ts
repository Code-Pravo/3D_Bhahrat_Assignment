import type { Deal, Investor, MatchBreakdown, Recommendation, RiskLevel } from "@/types";

// Weighted match-scoring constants (sums to 100%).
export const WEIGHTS = {
  risk: 0.25,
  industry: 0.25,
  budget: 0.25,
  roi: 0.25,
} as const;

/**
 * Risk-match: how well a deal's risk level aligns with the investor's
 * risk preference. A tolerance curve rewards close matches over distant ones.
 */
export function riskMatch(dealRisk: RiskLevel, investorRisk: RiskLevel): number {
  const curve: Record<RiskLevel, Record<RiskLevel, number>> = {
    Low: { Low: 100, Moderate: 75, High: 35, "Very High": 10 },
    Moderate: { Low: 80, Moderate: 100, High: 70, "Very High": 35 },
    High: { Low: 45, Moderate: 80, High: 100, "Very High": 70 },
    "Very High": { Low: 10, Moderate: 40, High: 75, "Very High": 100 },
  };
  return curve[investorRisk][dealRisk];
}

/** Industry-match: 100 for preferred, reduced for others (no geographic data to consider). */
export function industryMatch(dealIndustry: string, preferred: string[]): number {
  if (preferred.length === 0) return 60;
  if (preferred.includes(dealIndustry)) return 100;
  return 25;
}

/** Budget-match: full credit when the minimum ticket fits the budget, prorated otherwise. */
export function budgetMatch(deal: Deal, budget: number): number {
  if (budget <= 0) return 0;
  const ratio = budget / deal.minimumInvestment;
  if (ratio >= 1) return 100;
  return Math.round(ratio * 80);
}

/** ROI-attractiveness: full credit when the deal exceeds the target ROI, prorated below. */
export function roiMatch(dealROI: number, targetROI: number): number {
  if (targetROI <= 0) return 50;
  if (dealROI >= targetROI) return 100;
  return Math.round((dealROI / targetROI) * 100);
}

/** Compute the 0-100 match for a single deal against an investor's profile. */
export function calculateMatch(deal: Deal, investor: Investor): Recommendation {
  const breakdown: MatchBreakdown = {
    risk: riskMatch(deal.riskLevel, investor.riskPreference),
    industry: industryMatch(deal.industry, investor.preferredIndustries),
    budget: budgetMatch(deal, investor.budget),
    roi: roiMatch(deal.expectedROI, investor.expectedROI),
  };
  const score = Math.round(
    breakdown.risk * WEIGHTS.risk +
      breakdown.industry * WEIGHTS.industry +
      breakdown.budget * WEIGHTS.budget +
      breakdown.roi * WEIGHTS.roi,
  );
  return { deal, score, breakdown };
}

/** Score a whole list and return it sorted by descending match (stable). */
export function scoreAndRank(deals: Deal[], investor: Investor): Recommendation[] {
  return deals
    .map((deal) => calculateMatch(deal, investor))
    .sort((a, b) => b.score - a.score);
}
