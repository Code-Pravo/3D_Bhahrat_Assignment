import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Deal,
  DealFilters,
  InvestmentRecord,
  PaginationMeta,
  SortOption,
} from "@/types";
import {
  getDealById,
  getDeals,
  getDealsPaginated,
  getDealStatistics,
  type DealStatistics,
} from "@/services/dealService";
import { emptyFilters } from "@/utils/filters";
import type { RootState } from "../store";

export interface DealsState {
  items: Deal[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  query: string;
  filters: DealFilters;
  sortBy: SortOption;
  page: number;
  pageSize: number;
  selectedDeal: Deal | null;
  selectedLoading: boolean;
  selectedError: string | null;
  cachedDeals: Record<string, Deal>;
  stats: DealStatistics | null;
  statsLoading: boolean;
  statsError: string | null;
  allDeals: Deal[];
  allDealsLoading: boolean;
  allDealsError: string | null;
}

const initialState: DealsState = {
  items: [],
  meta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
  loading: false,
  error: null,
  query: "",
  filters: emptyFilters(),
  sortBy: "newest",
  page: 1,
  pageSize: 8,
  selectedDeal: null,
  selectedLoading: false,
  selectedError: null,
  cachedDeals: {},
  stats: null,
  statsLoading: false,
  statsError: null,
  allDeals: [],
  allDealsLoading: false,
  allDealsError: null,
};

export const fetchDeals = createAsyncThunk(
  "deals/fetchList",
  async (_: void, { getState }) => {
    const { deals } = getState() as RootState;
    const result = await getDealsPaginated({
      page: deals.page,
      pageSize: deals.pageSize,
      query: deals.query,
      filters: deals.filters,
      sortBy: deals.sortBy,
    });
    return result;
  },
  {
    condition: (_: void, { getState }) => {
      const { deals } = getState() as RootState;
      return !deals.loading;
    },
  },
);

export const fetchDealById = createAsyncThunk(
  "deals/fetchById",
  async (id: string, { getState }) => {
    const { deals } = getState() as RootState;
    if (deals.cachedDeals[id]) {
      return { id, deal: deals.cachedDeals[id], fromCache: true };
    }
    const deal = await getDealById(id);
    return { id, deal, fromCache: false };
  },
);

export const fetchDealStatistics = createAsyncThunk(
  "deals/fetchStats",
  async () => getDealStatistics(),
);

export const fetchAllDeals = createAsyncThunk(
  "deals/fetchAll",
  async () => getDeals(),
  {
    condition: (_: void, { getState }) => {
      const { deals } = getState() as RootState;
      return deals.allDeals.length === 0 && !deals.allDealsLoading;
    },
  },
);

const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.page = 1;
    },
    setFilters(state, action: PayloadAction<DealFilters>) {
      state.filters = action.payload;
      state.page = 1;
    },
    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
    },
    cacheDeal(state, action: PayloadAction<Deal>) {
      state.cachedDeals[action.payload.id] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.meta = action.payload.meta;
        for (const deal of action.payload.items) {
          state.cachedDeals[deal.id] = deal;
        }
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load deals.";
      })
      .addCase(fetchDealById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchDealById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedDeal = action.payload.deal;
        state.cachedDeals[action.payload.id] = action.payload.deal;
      })
      .addCase(fetchDealById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.error.message ?? "Failed to load deal.";
      })
      .addCase(fetchDealStatistics.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchDealStatistics.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDealStatistics.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.error.message ?? "Failed to load statistics.";
      })
      .addCase(fetchAllDeals.pending, (state) => {
        state.allDealsLoading = true;
        state.allDealsError = null;
      })
      .addCase(fetchAllDeals.fulfilled, (state, action) => {
        state.allDealsLoading = false;
        state.allDeals = action.payload;
        for (const deal of action.payload) {
          state.cachedDeals[deal.id] = deal;
        }
      })
      .addCase(fetchAllDeals.rejected, (state, action) => {
        state.allDealsLoading = false;
        state.allDealsError = action.error.message ?? "Failed to load deals.";
      });
  },
});

export const { setQuery, setFilters, setSortBy, setPage, setPageSize, cacheDeal } =
  dealsSlice.actions;
export default dealsSlice.reducer;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------
export const selectDealsState = (state: RootState) => state.deals;
export const selectDealById = (id: string) => (state: RootState): Deal | null =>
  state.deals.cachedDeals[id] ?? null;

