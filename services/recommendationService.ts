import type { Deal, Investor, Recommendation } from "@/types";
import { calculateMatch, scoreAndRank } from "@/utils/scoring";
import { getCurrentInvestor } from "./investorService";
import { getDeals } from "./dealService";
import { simulate } from "./mock";

export interface RecommendationQuery {
  limit?: number;
  minimumScore?: number;
  excludedIds?: string[];
}

/**
 * Frontend recommendation engine. Combines the investor's preferences with the
 * weighted match-score algorithm and returns deals ranked by fit.
 */
export function getRecommendations(query: RecommendationQuery = {}): Promise<Recommendation[]> {
  const { limit, minimumScore = 0, excludedIds = [] } = query;
  return simulate<Recommendation[]>(async () => {
    const [deals, investor] = await Promise.all([getDeals(), getCurrentInvestor()]);
    const excluded = new Set(excludedIds);
    let ranked = scoreAndRank(deals, investor).filter(
      (r) => r.score >= minimumScore && !excluded.has(r.deal.id),
    );
    if (limit) ranked = ranked.slice(0, limit);
    return ranked;
  });
}

/** Scores a single deal against the current investor's profile. */
export function getRecommendationForDeal(deal: Deal, investor?: Investor): Promise<Recommendation> {
  return simulate<Recommendation>(async () => {
    const profile = investor ?? (await getCurrentInvestor());
    return calculateMatch(deal, profile);
  });
}

/** All recommendations for a given investor profile (used in settings previews). */
export function scoreAllForInvestor(
  deals: Deal[],
  investor: Investor,
): Promise<Recommendation[]> {
  return simulate<Recommendation[]>(() => scoreAndRank(deals, investor));
}
