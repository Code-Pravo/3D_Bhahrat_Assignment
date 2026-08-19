import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InvestmentRecord } from "@/types";
import { simulate } from "@/services/mock";
import { STORAGE_KEYS } from "@/utils/constants";
import type { RootState } from "../store";

export interface InterestsState {
  interestedIds: string[];
  investments: InvestmentRecord[];
  hydrated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: InterestsState = {
  interestedIds: [],
  investments: [],
  hydrated: false,
  loading: false,
  error: null,
};

function persistInterests(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEYS.interests, JSON.stringify(ids));
}

function persistInvestments(records: InvestmentRecord[]) {
  window.localStorage.setItem(STORAGE_KEYS.invested, JSON.stringify(records));
}

/**
 * Loads saved interests / investments. The first run falls back to the current
 * investor's dataset profile (portfolio + interests).
 */
export const hydrateInterests = createAsyncThunk(
  "interests/hydrate",
  async (_: void, { getState }) => {
    const { investors } = getState() as RootState;
    const profile = investors.current;
    return simulate(() => {
      const storedIds = window.localStorage.getItem(STORAGE_KEYS.interests);
      const storedInvestments = window.localStorage.getItem(STORAGE_KEYS.invested);
      const interests = storedIds
        ? (JSON.parse(storedIds) as string[])
        : [...(profile?.interests ?? [])];
      const investments = storedInvestments
        ? (JSON.parse(storedInvestments) as InvestmentRecord[])
        : (profile?.portfolio ?? []).map((h) => ({
            dealId: h.dealId,
            amount: h.amount,
            date: h.date,
          }));
      return { interests, investments };
    });
  },
);

const interestsSlice = createSlice({
  name: "interests",
  initialState,
  reducers: {
    addInterest(state, action: PayloadAction<string>) {
      if (!state.interestedIds.includes(action.payload)) {
        state.interestedIds.push(action.payload);
        persistInterests(state.interestedIds);
      }
    },
    removeInterest(state, action: PayloadAction<string>) {
      state.interestedIds = state.interestedIds.filter((id) => id !== action.payload);
      persistInterests(state.interestedIds);
    },
    toggleInterest(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.interestedIds = state.interestedIds.includes(id)
        ? state.interestedIds.filter((x) => x !== id)
        : [...state.interestedIds, id];
      persistInterests(state.interestedIds);
    },
    addInvestment(
      state,
      action: PayloadAction<{ dealId: string; amount: number; date?: string }>,
    ) {
      const { dealId, amount, date } = action.payload;
      const existing = state.investments.find((r) => r.dealId === dealId);
      if (existing) {
        existing.amount += amount;
        existing.date = date ?? new Date().toISOString();
      } else {
        state.investments.unshift({
          dealId,
          amount,
          date: date ?? new Date().toISOString(),
        });
      }
      // Investing implies interest.
      if (!state.interestedIds.includes(dealId)) {
        state.interestedIds.push(dealId);
      }
      persistInvestments(state.investments);
      persistInterests(state.interestedIds);
    },
    removeInvestment(state, action: PayloadAction<string>) {
      state.investments = state.investments.filter((r) => r.dealId !== action.payload);
      persistInvestments(state.investments);
    },
    clearAllInterests(state) {
      state.interestedIds = [];
      state.investments = [];
      window.localStorage.removeItem(STORAGE_KEYS.interests);
      window.localStorage.removeItem(STORAGE_KEYS.invested);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateInterests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hydrateInterests.fulfilled, (state, action) => {
        state.loading = false;
        state.hydrated = true;
        state.interestedIds = action.payload.interests;
        state.investments = action.payload.investments;
      })
      .addCase(hydrateInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load saved interests.";
      });
  },
});

export const {
  addInterest,
  removeInterest,
  toggleInterest,
  addInvestment,
  removeInvestment,
  clearAllInterests,
} = interestsSlice.actions;
export default interestsSlice.reducer;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------
export const selectInterests = (state: RootState) => state.interests;
export const selectInterestedIds = (state: RootState) => state.interests.interestedIds;
export const selectInvestments = (state: RootState) => state.interests.investments;
export const selectIsInterested = (dealId: string) => (state: RootState) =>
  state.interests.interestedIds.includes(dealId);
