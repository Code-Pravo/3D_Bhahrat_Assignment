import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThemeMode } from "@/types";
import { STORAGE_KEYS } from "@/utils/constants";

function initialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export interface UiState {
  theme: ThemeMode;
  mobileNavOpen: boolean;
  sidebarCollapsed: boolean;
}

const initialState: UiState = {
  theme: initialTheme(),
  mobileNavOpen: false,
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.theme, action.payload);
      }
    },
    toggleTheme(state) {
      const next: ThemeMode = state.theme === "dark" ? "light" : "dark";
      state.theme = next;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.theme, next);
      }
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { setTheme, toggleTheme, setMobileNavOpen, toggleSidebarCollapsed } =
  uiSlice.actions;
export default uiSlice.reducer;
