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
