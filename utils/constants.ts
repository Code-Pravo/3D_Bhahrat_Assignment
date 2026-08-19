import type { DealStatus, RiskLevel } from "@/types";

// Shared constants used across the UI, services and state.
export const DEFAULT_PAGE_SIZE = 8;

export const RISK_LEVELS: RiskLevel[] = ["Low", "Moderate", "High", "Very High"];

export const DEAL_STATUSES: DealStatus[] = ["Open", "Closed", "Coming Soon", "Active"];

// Industry list is derived from the dataset at runtime, but the canonical
// order below keeps filter UIs stable and predictable.
export const INDUSTRIES = [
  "Fintech",
  "Healthcare",
  "EdTech",
  "E-commerce",
  "SaaS",
  "AgriTech",
  "Logistics",
  "Renewable Energy",
  "Real Estate",
  "Manufacturing",
  "Media & Entertainment",
  "Travel & Hospitality",
];

export const STORAGE_KEYS = {
  interests: "3dbharat.interests",
  invested: "3dbharat.invested",
  profile: "3dbharat.profile",
  theme: "3dbharat.theme",
  onboarding: "3dbharat.onboarding",
} as const;

// Simulated latency bounds for every mocked service call (ms).
export const LATENCY_MIN = 300;
export const LATENCY_MAX = 800;

export const RISK_COLORS: Record<RiskLevel, string> = {
  Low: "#10b981",
  Moderate: "#f59e0b",
  High: "#f97316",
  "Very High": "#ef4444",
};
