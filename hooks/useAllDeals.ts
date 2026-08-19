import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAllDeals, selectDealsState } from "@/store/slices/dealsSlice";

/**
 * Provides the full deal catalogue (cached in Redux after the first load).
 * Used by dashboards that need cross-deal aggregates.
 */
export function useAllDeals() {
  const dispatch = useAppDispatch();
  const { allDeals, allDealsLoading, allDealsError } = useAppSelector(selectDealsState);

  useEffect(() => {
    if (allDeals.length === 0 && !allDealsLoading) {
      dispatch(fetchAllDeals());
    }
  }, [dispatch, allDeals.length, allDealsLoading]);

  const retry = useCallback(() => dispatch(fetchAllDeals()), [dispatch]);

  return { deals: allDeals, loading: allDealsLoading, error: allDealsError, retry };
}
