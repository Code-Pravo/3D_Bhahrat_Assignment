import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Investor } from "@/types";
import {
  getCurrentInvestor,
  getInvestorById,
  getInvestors,
  updateInvestorProfile,
} from "@/services/investorService";
import { STORAGE_KEYS } from "@/utils/constants";
import type { RootState } from "../store";

export interface InvestorState {
  current: Investor | null;
  investors: Investor[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  saveError: string | null;
}

const initialState: InvestorState = {
  current: null,
  investors: [],
  loading: false,
  error: null,
  saving: false,
  saveError: null,
};

function applyStoredProfile(investor: Investor): Investor {
  if (typeof window === "undefined") return investor;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.profile);
    if (!stored) return investor;
    const patch = JSON.parse(stored) as Partial<Investor>;
    return { ...investor, ...patch, id: investor.id };
  } catch {
    return investor;
  }
}

export const fetchCurrentInvestor = createAsyncThunk(
  "investors/fetchCurrent",
  async () => {
    const investor = await getCurrentInvestor();
    return applyStoredProfile(investor);
  },
);

export const fetchInvestors = createAsyncThunk("investors/fetchAll", async () => getInvestors());

export const fetchInvestor = createAsyncThunk(
  "investors/fetchOne",
  async (id: string) => getInvestorById(id),
);

export const saveProfile = createAsyncThunk(
  "investors/saveProfile",
  async (patch: Partial<Investor>, { getState }) => {
    const { investors } = getState() as RootState;
    if (!investors.current) throw new Error("Investor profile is not loaded.");
    const updated = await updateInvestorProfile(investors.current.id, patch);
    const merged = applyStoredProfile(updated);
    if (typeof window !== "undefined") {
      const { id: _id, portfolio: _portfolio, interests: _interests, ...persisted } = merged;
      window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(persisted));
    }
    return merged;
  },
);

const investorSlice = createSlice({
  name: "investors",
  initialState,
  reducers: {
    clearInvestorError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentInvestor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentInvestor.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchCurrentInvestor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load investor profile.";
      })
      .addCase(fetchInvestors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestors.fulfilled, (state, action) => {
        state.loading = false;
        state.investors = action.payload;
      })
      .addCase(fetchInvestors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load investors.";
      })
      .addCase(saveProfile.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.current = action.payload;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.error.message ?? "Failed to save profile.";
      });
  },
});

export const { clearInvestorError } = investorSlice.actions;
export default investorSlice.reducer;

export const selectCurrentInvestor = (state: RootState) => state.investors.current;
export const selectInvestorsState = (state: RootState) => state.investors;

export interface InvestorProfilePatch extends Partial<Investor> {
  budget?: number;
  expectedROI?: number;
  preferredIndustries?: string[];
  riskPreference?: Investor["riskPreference"];
}
