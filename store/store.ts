import { configureStore } from "@reduxjs/toolkit";
import dealsReducer from "./slices/dealsSlice";
import investorReducer from "./slices/investorSlice";
import interestsReducer from "./slices/interestsSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    deals: dealsReducer,
    investors: investorReducer,
    interests: interestsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
