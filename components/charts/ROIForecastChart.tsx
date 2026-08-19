"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactINR } from "@/utils/format";
import { ChartTooltip, useChartTheme } from "./chartTheme";

export interface ForecastPoint {
  year: string;
  invested: number;
  projected: number;
}

/**
 * Interactive-style ROI projection: shows the capital's compound growth at the
 * deal's expected annual ROI over its investment duration.
 */
export function buildForecastPoints(capital: number, annualROI: number, years: number): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  for (let y = 0; y <= years; y += 1) {
    points.push({
      year: y === 0 ? "Now" : `Yr ${y}`,
      invested: capital,
      projected: Math.round(capital * Math.pow(1 + annualROI / 100, y)),
    });
  }
  return points;
}

export function ROIForecastChart({ data }: { data: ForecastPoint[] }) {
  const theme = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="year" tick={{ fill: theme.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: theme.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCompactINR(v)}
          width={70}
        />
        <Tooltip content={<ChartTooltip formatter={(v: number) => formatCompactINR(v)} />} />
        <Line
          type="monotone"
          dataKey="invested"
          name="Your capital"
          stroke="#94a3b8"
          strokeDasharray="5 5"
          dot={false}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="projected"
          name="Projected value"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}