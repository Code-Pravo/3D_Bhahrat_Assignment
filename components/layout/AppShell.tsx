"use client";

import type { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setMobileNavOpen } from "@/store/slices/uiSlice";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

/**
 * Application shell used by all authenticated pages.
 * Desktop: fixed sidebar + main column. Tablet/mobile: collapsible drawer.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const mobileNavOpen = useAppSelector((state) => state.ui.mobileNavOpen);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop sidebar */}
      <Sidebar variant="desktop" />

      {/* Mobile navigation drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            aria-label="Close navigation overlay"
            tabIndex={-1}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => dispatch(setMobileNavOpen(false))}
          />
          <div className="animate-fade-in absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
            <Sidebar variant="mobile" onNavigate={() => dispatch(setMobileNavOpen(false))} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Header />
        <main id="main" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}