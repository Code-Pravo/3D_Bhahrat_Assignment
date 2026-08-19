import { useEffect } from "react";
import type { Investor } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCurrentInvestor,
  fetchInvestors,
  selectCurrentInvestor,
  selectInvestorsState,
} from "@/store/slices/investorSlice";

/** Loads the full investor directory on first use. */
export function useInvestors() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectInvestorsState);

  useEffect(() => {
    if (!state.investors.length && !state.loading) {
      dispatch(fetchInvestors());
    }
  }, [dispatch, state.investors.length, state.loading]);

  return state;
}

/** Loads and returns the simulated logged-in investor. */
export function useCurrentInvestor(): Investor | null {
  const dispatch = useAppDispatch();
  const current = useAppSelector(selectCurrentInvestor);

  useEffect(() => {
    if (!current) {
      dispatch(fetchCurrentInvestor());
    }
  }, [dispatch, current]);

  return current;
}
