import type { RiskLevel } from "@/types";
import { Badge } from "./Badge";

const TONE: Record<RiskLevel, "success" | "warning" | "danger" | "danger"> = {
  Low: "success",
  Moderate: "warning",
  High: "danger",
  "Very High": "danger",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge tone={TONE[level]}>{level}</Badge>;
}

export function ROIBadge({ roi }: { roi: number }) {
  const tone = roi >= 25 ? "success" : roi >= 15 ? "brand" : "neutral";
  return <Badge tone={tone}>{roi.toFixed(1)}% ROI</Badge>;
}
