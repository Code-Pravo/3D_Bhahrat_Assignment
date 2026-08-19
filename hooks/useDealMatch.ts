import { useCallback, useEffect, useRef, useState } from "react";
import type { Deal, Recommendation } from "@/types";
import { getRecommendationForDeal } from "@/services/recommendationService";

/**
 * Scores a single deal against the current investor's profile through the
 * recommendation service, with loading + error handling.
 */
export function useDealMatch(deal: Deal | null) {
  const [match, setMatch] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async (dealRef: Deal) => {
    const current = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await getRecommendationForDeal(dealRef);
      if (requestId.current === current) setMatch(result);
    } catch (err) {
      if (requestId.current === current) {
        setError(err instanceof Error ? err.message : "Failed to score deal.");
      }
    } finally {
      if (requestId.current === current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (deal) {
      load(deal);
    }
  }, [deal, load]);

  return { match, loading, error };
}

