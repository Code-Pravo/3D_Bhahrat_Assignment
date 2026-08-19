"use client";

import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCurrentInvestor } from "@/store/slices/investorSlice";
import { hydrateInterests } from "@/store/slices/interestsSlice";

/** Applies the active theme class and hydrates async app-level state once. */
function AppBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    dispatch(fetchCurrentInvestor());
  }, [dispatch]);

  const hydrated = useAppSelector((state) => state.interests.hydrated);
  const investor = useAppSelector((state) => state.investors.current);

  useEffect(() => {
    if (investor && !hydrated) {
      dispatch(hydrateInterests());
    }
  }, [investor, hydrated, dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AppBootstrap>{children}</AppBootstrap>
    </Provider>
  );
}
