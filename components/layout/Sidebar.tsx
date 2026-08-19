"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Briefcase,
  Compass,
  LayoutDashboard,
  Settings,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useAppSelector } from "@/store";
import { initials } from "@/utils/format";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/deals", label: "Explore Deals", icon: Compass },
  { href: "/recommendations", label: "Recommendations", icon: Sparkles },
  { href: "/investments", label: "My Investments", icon: Briefcase },
  { href: "/corporate", label: "Corporate", icon: Building2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({
  variant = "desktop",
  onNavigate,
}: {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? "";
  const investor = useAppSelector((state) => state.investors.current);

  const content = (
    <>
      <div className="flex items-center gap-2 px-3 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-md">
          <TrendingUp className="h-5 w-5" aria-hidden />
        </span>
        <div className="leading-tight">
          <p className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
            3D Bharat
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Investment Platform
          </p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="mt-2 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                active
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] transition-transform group-hover:scale-110 ${
                  active ? "text-brand-600 dark:text-brand-400" : ""
                }`}
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <Link
          href="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-slate-800"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
            {investor ? initials(investor.name) : "—"}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              {investor?.name ?? "Investor"}
            </span>
            <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
              {investor?.email ?? "loading profile…"}
            </span>
          </span>
        </Link>
      </div>
    </>
  );

  if (variant === "desktop") {
    return (
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
        {content}
      </aside>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between pr-3">
        {content}
        <button
          onClick={onNavigate}
          aria-label="Close menu"
          className="mr-2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}