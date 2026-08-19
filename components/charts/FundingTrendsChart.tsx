"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/utils/calculations";
import { formatCompactINR } from "@/utils/format";
import { ChartTooltip, useChartTheme } from "./chartTheme";

export function FundingTrendsChart({ data }: { data: TrendPoint[] }) {
  const theme = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fundingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: theme.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: theme.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCompactINR(v)}
          width={64}
        />
        <Tooltip content={<ChartTooltip formatter={(v: number) => formatCompactINR(v)} />} />
        <Area
          type="monotone"
          dataKey="value"
          name="Funding raised"
          stroke="#10b981"
          strokeWidth={2.5}
          fill="url(#fundingGradient)"
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}