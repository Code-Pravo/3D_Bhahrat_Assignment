"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Compass,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const FEATURES = [
  {
    icon: Compass,
    title: "Deal Discovery",
    description:
      "Search and filter 80+ curated investment opportunities across 12 industries with debounced search, combined filters and fast pagination.",
  },
  {
    icon: Sparkles,
    title: "Recommendation Engine",
    description:
      "A weighted match-score engine (risk, industry, budget and ROI) ranks every deal against your investor profile in real time.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboards",
    description:
      "Interactive Recharts visualisations for portfolio growth, industry distribution, risk versus return and corporate funding trends.",
  },
  {
    icon: Building2,
    title: "Corporate Analytics",
    description:
      "Track funding raised, investor growth, conversion rates and industry allocation across the whole deal catalogue.",
  },
  {
    icon: ShieldCheck,
    title: "Simulated Data Layer",
    description:
      "No backend, no API keys. A service layer with realistic latency, loading, error and empty states powers every screen.",
  },
  {
    icon: Zap,
    title: "Performance First",
    description:
      "Debounced inputs, memoised selectors, cached Redux state, lazy-loaded charts and skeleton loaders keep the app fast.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-md">
            <TrendingUp className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
            3D Bharat
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Launch app <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-950/60 dark:text-brand-300">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            Frontend-only · simulated data services · no backend
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
            Invest in Bharat&apos;s next{" "}
            <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              billion-dollar ideas
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            3D Bharat is a fintech investment dashboard where investors discover deals,
            receive personalised recommendations and track portfolios — while corporates
            monitor funding and investor analytics.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-brand-700"
            >
              Explore the dashboard <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Browse deals
            </Link>
          </div>

          <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <dd className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-50">
            Built like a real production platform
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                  <feature.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-brand-700 to-accent-700 p-8 text-center text-white sm:p-12">
            <Wallet className="h-8 w-8" aria-hidden />
            <h2 className="text-2xl font-bold">Ready to build your portfolio?</h2>
            <p className="max-w-xl text-sm text-white/80">
              Everything runs in the browser with mock data — explore deals, get scored
              recommendations and simulate investments without spending a rupee.
            </p>
            <Link
              href="/dashboard"
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition-transform hover:scale-[1.03]"
            >
              Get started <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        3D Bharat · A simulated fintech investment platform · No real money or external APIs
      </footer>
    </div>
  );
}

const STATS = [
  { value: "80+", label: "Investment deals" },
  { value: "12", label: "Industries" },
  { value: "14", label: "Investors" },
  { value: "4", label: "Weighted match factors" },
];
