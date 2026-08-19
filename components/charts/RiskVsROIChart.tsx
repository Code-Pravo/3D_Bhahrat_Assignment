"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RISK_LEVELS } from "@/utils/constants";
import { formatCompactINR, formatPercent } from "@/utils/format";
import { ChartTooltip, useChartTheme } from "./chartTheme";

export interface RiskRoiPoint {
  riskIndex: number;
  riskLevel: string;
  expectedROI: number;
  companyName?: string;
  investmentRequired?: number;
}

export function RiskVsROIChart({ data }: { data: RiskRoiPoint[] }) {
  const theme = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 10, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" />
        <XAxis
          dataKey="riskIndex"
          type="number"
          name="Risk"
          domain={[0.5, 4.5]}
          ticks={[1, 2, 3, 4]}
          tickFormatter={(v: number) => RISK_LEVELS[v - 1] ?? ""}
          tick={{ fill: theme.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          dataKey="expectedROI"
          type="number"
          name="Expected ROI"
          unit="%"
          tick={{ fill: theme.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: theme.axis }}
          content={
            <ChartTooltip
              formatter={(v: number, entry: { dataKey?: string }) =>
                entry?.dataKey === "investmentRequired"
                  ? formatCompactINR(v)
                  : `${v}%`
              }
            />
          }
        />
        <Scatter data={data} fill="#6366f1" fillOpacity={0.7} stroke="#4f46e5" name="Deal" animationDuration={800} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function toRiskRoiPoints(
  deals: { riskLevel: string; expectedROI: number; companyName?: string; investmentRequired?: number }[],
): RiskRoiPoint[] {
  return deals.map((d) => ({
    riskIndex: Math.max(1, RISK_LEVELS.indexOf(d.riskLevel as (typeof RISK_LEVELS)[number]) + 1),
    riskLevel: d.riskLevel,
    expectedROI: d.expectedROI,
    companyName: d.companyName,
    investmentRequired: d.investmentRequired,
  }));
}

export function riskTooltipFormatter(value: number): string {
  return formatPercent(value, 0);
}