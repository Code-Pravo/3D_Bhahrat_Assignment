import { useCallback, useEffect, useMemo, useState } from "react";
import type { Recommendation } from "@/types";
import { getRecommendations } from "@/services/recommendationService";
import { useCurrentInvestor } from "./useInvestors";

export interface UseRecommendationsOptions {
  limit?: number;
  minimumScore?: number;
}

/**
 * Loads personalised recommendations from the recommendation service, keyed to
 * the current investor. The service call is memoized per investor and options,
 * and re-runs only when the relevant inputs change.
 */
export function useRecommendations(options: UseRecommendationsOptions = {}) {
  const { limit, minimumScore } = options;
  const investor = useCurrentInvestor();

  const [items, setItems] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRecommendations({ limit, minimumScore });
      setItems(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  }, [limit, minimumScore]);

  useEffect(() => {
    if (investor) {
      refetch();
    }
  }, [investor, refetch]);

  return useMemo(
    () => ({ recommendations: items, loading, error, refetch }),
    [items, loading, error, refetch],
  );
}
