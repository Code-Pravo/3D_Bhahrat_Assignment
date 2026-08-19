"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Coins,
  IndianRupee,
  MapPin,
  Percent,
  TrendingUp,
  Users,
} from "lucide-react";

import { useDeal } from "@/hooks/useDeal";
import { useDealMatch } from "@/hooks/useDealMatch";
import { useAllDeals } from "@/hooks/useAllDeals";
import { useInvestors } from "@/hooks/useInvestors";
import { useAppSelector } from "@/store";
import { selectInvestments } from "@/store/slices/interestsSlice";
import { formatCompactINR, formatDate, formatINR, formatPercent } from "@/utils/format";
import { buildForecastPoints } from "@/components/charts/ROIForecastChart";
import { RiskAnalysis } from "@/components/deals/RiskAnalysis";
import { SaveButton } from "@/components/deals/SaveButton";
import { InvestDealModal } from "@/components/deals/InvestDealModal";
import { Tabs } from "@/components/common/Tabs";
import { Accordion } from "@/components/common/Accordion";
import { Badge } from "@/components/common/Badge";
import { RiskBadge, ROIBadge } from "@/components/common/RiskBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { Button } from "@/components/common/Button";
import { DashboardCard } from "@/components/common/DashboardCard";
import { MetricCard } from "@/components/common/MetricCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { MatchBadge, MatchBreakdown } from "@/components/recommendations/RecommendationCard";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { DealCard } from "@/components/deals/DealCard";

const ROIForecastChart = dynamic(
  () => import("@/components/charts/ROIForecastChart").then((m) => m.ROIForecastChart),
  {
    ssr: false,
    loading: () => <div className="h-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />,
  },
);

const RevenueProfitChart = dynamic(
  () => import("@/components/charts/RevenueProfitChart").then((m) => m.RevenueProfitChart),
  {
    ssr: false,
    loading: () => <div className="h-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />,
  },
);

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "financials", label: "Financials" },
  { id: "risk", label: "Risk Analysis" },
  { id: "investors", label: "Investors" },
];

export default function DealDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { deal, loading, error, retry } = useDeal(id);
  const { match, loading: matchLoading } = useDealMatch(deal);
  const { deals } = useAllDeals();
  const investorsState = useInvestors();
  const investments = useAppSelector(selectInvestments);

  const [tab, setTab] = useState("overview");
  const [investOpen, setInvestOpen] = useState(false);

  const isInvested = investments.some((inv) => inv.dealId === id);
  const isSaved = useAppSelector((state) => state.interests.interestedIds.includes(id));

  const relatedDeals = useMemo(() => {
    if (!deal) return [];
    return deals.filter((d) => d.industry === deal.industry && d.id !== deal.id).slice(0, 3);
  }, [deals, deal]);

  const investorsInDeal = useMemo(
    () =>
      investorsState.investors.filter((investor) =>
        investor.portfolio.some((holding) => holding.dealId === id),
      ),
    [investorsState.investors, id],
  );

  const forecast = useMemo(
    () =>
      deal
        ? buildForecastPoints(deal.minimumInvestment, deal.expectedROI, Math.ceil(deal.duration / 12))
        : [],
    [deal],
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Link
          href="/deals"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to deals
        </Link>
        <LoadingSkeleton variant="table" count={6} />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="space-y-6">
        <Link
          href="/deals"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to deals
        </Link>
        <ErrorState message={error ?? "Deal not found."} onRetry={retry} />
      </div>
    );
  }

  const revenueProfit = [
    { label: "Revenue", value: deal.revenue },
    { label: "Profit", value: Math.max(0, deal.profit) },
  ];

  return (
    <div className="space-y-6">
      {/* Header + primary actions */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href="/deals"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to deals
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {deal.companyName}
            </h1>
            <Badge tone={deal.dealStatus === "Open" ? "success" : "neutral"}>
              {deal.dealStatus}
            </Badge>
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden /> {deal.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-4 w-4" aria-hidden /> {deal.industry}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" aria-hidden /> Founded {deal.foundedYear}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ROIBadge roi={deal.expectedROI} />
            <RiskBadge level={deal.riskLevel} />
            {match && <MatchBadge score={match.score} />}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <SaveButton dealId={deal.id} />
          <Button onClick={() => setInvestOpen(true)}>
            <Coins className="h-4 w-4" aria-hidden />
            {isInvested ? "Invest more" : "Invest now"}
          </Button>
        </div>
      </div>

      {/* Match breakdown */}
      <DashboardCard title="Match score" subtitle="How this deal fits your investor profile">
        {matchLoading ? (
          <LoadingSkeleton variant="table" count={4} />
        ) : match ? (
          <MatchBreakdown recommendation={match} />
        ) : (
          <EmptyState title="No match score available" />
        )}
      </DashboardCard>

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Minimum investment"
          value={formatCompactINR(deal.minimumInvestment)}
          icon={<Coins className="h-4 w-4" aria-hidden />}
        />
        <MetricCard
          label="Funding progress"
          value={`${deal.fundingProgress}%`}
          icon={<TrendingUp className="h-4 w-4" aria-hidden />}
        />
        <MetricCard
          label="Expected ROI"
          value={formatPercent(deal.expectedROI)}
          icon={<Percent className="h-4 w-4" aria-hidden />}
        />
        <MetricCard
          label="Investors"
          value={String(deal.investorCount)}
          icon={<Users className="h-4 w-4" aria-hidden />}
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <DashboardCard title="About this company" className="lg:col-span-2">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {deal.description}
            </p>
          </DashboardCard>
          <DashboardCard title="Funding progress">
            <ProgressBar value={deal.fundingProgress} />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {deal.investorCount} investors · {formatCompactINR(deal.investmentRequired)}{" "}
              sought
            </p>
          </DashboardCard>
        </div>
      )}

{tab === "financials" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Revenue & Profit" subtitle="Annualised figures (₹)" height={260}>
            <RevenueProfitChart data={revenueProfit} />
          </ChartCard>
          <ChartCard
            title="ROI forecast"
            subtitle={`Projected value over ${Math.ceil(deal.duration / 12)} years`}
            height={260}
          >
            <ROIForecastChart data={forecast} />
          </ChartCard>
        </div>
      )}

      {tab === "risk" && (
        <DashboardCard title="Risk analysis" subtitle="Factor-by-factor assessment">
          <RiskAnalysis deal={deal} />
        </DashboardCard>
      )}

      {tab === "investors" && (
        <DashboardCard
          title="Investors in this deal"
          subtitle={`${investorsInDeal.length} investor${investorsInDeal.length === 1 ? "" : "s"} committed`}
        >
          {investorsInDeal.length === 0 ? (
            <EmptyState
              title="No investors listed yet"
              description="Invest in this deal to be the first on the cap table."
            />
          ) : (
            <Accordion
              items={investorsInDeal.map((investor) => {
                const holding = investor.portfolio.find((h) => h.dealId === id);
                return {
                  id: investor.id,
                  title: investor.name,
                  badge: holding ? (
                    <Badge tone="brand">{formatCompactINR(holding.amount)}</Badge>
                  ) : undefined,
                  content: holding ? (
                    <p>
                      Allocated {formatINR(holding.amount)} on {formatDate(holding.date)}.
                    </p>
                  ) : (
                    <p>Committed to this deal.</p>
                  ),
                };
              })}
            />
          )}
        </DashboardCard>
      )}

      {/* Related deals */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
          Similar opportunities
        </h2>
        {relatedDeals.length === 0 ? (
          <EmptyState
            title="No similar deals"
            description="Check back later for opportunities in this industry."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedDeals.map((related, i) => (
              <DealCard key={related.id} deal={related} index={i} />
            ))}
          </div>
        )}
      </section>

      <InvestDealModal
        deal={deal}
        open={investOpen}
        onClose={() => setInvestOpen(false)}
      />
    </div>
  );
}
