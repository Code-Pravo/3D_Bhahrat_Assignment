import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDealById, selectDealsState } from "@/store/slices/dealsSlice";

/**
 * Loads a single deal by id (cached in Redux after the first visit) and
 * exposes loading / error / retry for the detail page.
 */
export function useDeal(id: string) {
  const dispatch = useAppDispatch();
  const { selectedDeal, selectedLoading, selectedError } = useAppSelector(selectDealsState);

  useEffect(() => {
    dispatch(fetchDealById(id));
  }, [dispatch, id]);

  const retry = useCallback(() => dispatch(fetchDealById(id)), [dispatch, id]);

  return { deal: selectedDeal, loading: selectedLoading, error: selectedError, retry };
}
