import { useCallback, useEffect } from "react";
import type { DealFilters, SortOption } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchDeals,
  selectDealsState,
  setFilters,
  setPage,
  setQuery,
  setSortBy,
} from "@/store/slices/dealsSlice";

/**
 * Central hook for the Deal Explorer. Wires the Redux deal slice to the mock
 * service and exposes imperative controls (query/filter/sort/page) that the
 * UI components dispatch. The fetch effect runs only when the applied
 * search, filter, sort or page changes.
 */
export function useDeals() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectDealsState);

  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch, state.query, state.filters, state.sortBy, state.page, state.pageSize]);

  const updateQuery = useCallback((q: string) => dispatch(setQuery(q)), [dispatch]);
  const updateFilters = useCallback((f: DealFilters) => dispatch(setFilters(f)), [dispatch]);
  const updateSort = useCallback((s: SortOption) => dispatch(setSortBy(s)), [dispatch]);
  const goToPage = useCallback((p: number) => dispatch(setPage(p)), [dispatch]);
  const retry = useCallback(() => dispatch(fetchDeals()), [dispatch]);

  return {
    ...state,
    updateQuery,
    updateFilters,
    updateSort,
    goToPage,
    retry,
  };
}
