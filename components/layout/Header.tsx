"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Bell, ChevronDown, Menu, UserRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setMobileNavOpen } from "@/store/slices/uiSlice";
import { ThemeToggle } from "./ThemeToggle";
import { initials } from "@/utils/format";

const TITLES: Record<string, string> = {
  "/": "Welcome",
  "/dashboard": "Investor Dashboard",
  "/deals": "Explore Deals",
  "/recommendations": "Recommendations",
  "/investments": "My Investments",
  "/corporate": "Corporate Analytics",
  "/settings": "Settings",
};

export function Header() {
  const dispatch = useAppDispatch();
  const pathname = usePathname() ?? "";
  const investor = useAppSelector((state) => state.investors.current);
  const [menuOpen, setMenuOpen] = useState(false);

  const title = useMemo(() => {
    if (TITLES[pathname]) return TITLES[pathname];
    if (pathname.startsWith("/deals/")) return "Deal Details";
    return "3D Bharat";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
      <button
        onClick={() => dispatch(setMobileNavOpen(true))}
        aria-label="Open navigation menu"
        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-50">
          {title}
        </h1>
        <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
          Frontend-only platform · simulated data services
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Bell className="h-5 w-5" aria-hidden />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-500" />
        </button>
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-slate-800"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
              {investor ? initials(investor.name) : "—"}
            </span>
            <span className="hidden text-sm font-medium text-slate-700 md:block dark:text-slate-200">
              {investor?.name.split(" ")[0] ?? "Investor"}
            </span>
            <ChevronDown
              className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${menuOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>

          {menuOpen && (
            <>
              <button
                aria-label="Close user menu"
                tabIndex={-1}
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setMenuOpen(false)}
              />
              <div
                role="menu"
                className="animate-fade-in absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {investor?.name ?? "Investor"}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {investor?.email ?? "…"}
                  </p>
                </div>
                <Link
                  href="/settings"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <UserRound className="h-4 w-4" aria-hidden /> Profile & Settings
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}