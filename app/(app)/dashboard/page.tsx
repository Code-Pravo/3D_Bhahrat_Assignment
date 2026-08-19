"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Briefcase, IndianRupee, PieChart, Percent, Sparkles } from "lucide-react";

import type { Deal } from "@/types";
import { useCurrentInvestor } from "@/hooks/useInvestors";
import { useAllDeals } from "@/hooks/useAllDeals";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useAppSelector } from "@/store";
import { selectInvestments } from "@/store/slices/interestsSlice";
import { investmentGrowthSeries, portfolioStats } from "@/utils/calculations";
import { formatCompactINR, formatPercent } from "@/utils/format";
import { MetricCard } from "@/components/common/MetricCard";
import { DashboardCard } from "@/components/common/DashboardCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { RiskDistributionCard } from "@/components/dashboard/RiskDistributionCard";

const InvestmentGrowthChart = dynamic(
  () => import("@/components/charts/InvestmentGrowthChart").then((m) => m.InvestmentGrowthChart),
  {
    ssr: false,
    loading: () => <div className="h-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />,
  },
);

const IndustryDistributionChart = dynamic(
  () =>
    import("@/components/charts/IndustryDistributionChart").then(
      (m) => m.IndustryDistributionChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />,
  },
);

const RiskVsROIChart = dynamic(
  () => import("@/components/charts/RiskVsROIChart").then((m) => m.RiskVsROIChart),
  {
    ssr: false,
    loading: () => <div className="h-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />,
  },
);

export default function DashboardPage() {
  const investor = useCurrentInvestor();
  const investments = useAppSelector(selectInvestments);
  const hydrated = useAppSelector((state) => state.interests.hydrated);
  const { deals, loading: dealsLoading, error: dealsError, retry } = useAllDeals();
  const { recommendations, loading: recLoading } = useRecommendations({ limit: 3 });

  const dealsMap = useMemo(() => {
    const map: Record<string, Deal> = {};
    for (const deal of deals) map[deal.id] = deal;
    return map;
  }, [deals]);

  const stats = useMemo(() => portfolioStats(investments, dealsMap), [investments, dealsMap]);
  const growthSeries = useMemo(() => investmentGrowthSeries(investments, 12), [investments]);
  const riskPoints = useMemo(
    () =>
      deals.map((d) => ({
        riskIndex: Math.max(1, ["Low", "Moderate", "High", "Very High"].indexOf(d.riskLevel) + 1),
        riskLevel: d.riskLevel,
        expectedROI: d.expectedROI,
        companyName: d.companyName,
        investmentRequired: d.investmentRequired,
      })),
    [deals],
  );

  const booting = !investor || !hydrated;
  const firstName = investor?.name.split(" ")[0] ?? "Investor";
const growthTrend = useMemo(() => {
    if (growthSeries.length < 2) return 0;
    const current = growthSeries[growthSeries.length - 1].value;
    const previous = growthSeries[growthSeries.length - 2].value;
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  }, [growthSeries]);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Welcome back, {firstName} 👋
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {investor
              ? `You have ${formatCompactINR(investor.budget)} available to invest this season.`
              : "Loading your profile…"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Explore deals <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Sparkles className="h-4 w-4" aria-hidden /> Recommendations
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Investments"
          value={formatCompactINR(stats.totalInvested)}
          icon={<IndianRupee className="h-4 w-4" aria-hidden />}
          trend={growthTrend}
          hint="vs prev month"
          loading={booting}
        />
        <MetricCard
          label="Active Deals"
          value={String(stats.activeDeals)}
          icon={<Briefcase className="h-4 w-4" aria-hidden />}
          loading={booting}
          hint="companies in portfolio"
        />
        <MetricCard
          label="Portfolio ROI"
          value={booting ? "—" : formatPercent(stats.avgROI)}
          icon={<Percent className="h-4 w-4" aria-hidden />}
          loading={booting}
          hint="weighted expected"
        />
        <MetricCard
          label="Industries Covered"
          value={String(stats.industries.length)}
          icon={<PieChart className="h-4 w-4" aria-hidden />}
          loading={booting}
          hint="of 12 tracked"
        />
      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Investment Growth"
          subtitle="Cumulative portfolio value — last 12 months"
          className="lg:col-span-2"
        >
          {investments.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                title="No investments yet"
                description="Explore deals and simulate your first investment to see growth over time."
                action={
                  <Link
                    href="/deals"
                    className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    Browse deals
                  </Link>
                }
              />
            </div>
          ) : (
            <InvestmentGrowthChart data={growthSeries} />
          )}
        </ChartCard>

        <ChartCard title="Industry Distribution" subtitle="Portfolio allocation by industry">
          <IndustryDistributionChart data={stats.industries} />
        </ChartCard>

        <ChartCard
          title="Risk vs ROI"
          subtitle="Every live deal compared by risk level and expected annual return"
          className="lg:col-span-2"
        >
          {dealsLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : dealsError ? (
            <ErrorState message={dealsError} onRetry={retry} />
          ) : deals.length === 0 ? (
            <EmptyState title="No deal data available" />
          ) : (
            <RiskVsROIChart data={riskPoints} />
          )}
        </ChartCard>

        <RiskDistributionCard distribution={stats.riskDistribution} loading={booting} />
      </div>

      {/* Recommendations preview */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
              <Sparkles className="h-5 w-5 text-brand-600" aria-hidden />
              Recommended for you
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Ranked by risk, industry, budget and ROI fit against your profile.
            </p>
          </div>
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            View all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {recLoading ? (
          <LoadingSkeleton count={3} />
        ) : recommendations.length === 0 ? (
          <EmptyState
            title="No recommendations found"
            description="Update your investor preferences in Settings to unlock personalised matches."
            action={
              <Link
                href="/settings"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Open settings
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendations.map((recommendation, i) => (
              <RecommendationCard
                key={recommendation.deal.id}
                recommendation={recommendation}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
