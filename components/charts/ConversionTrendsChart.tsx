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
import type { TrendPoint } from "@/utils/calculations";
import { ChartTooltip, useChartTheme } from "./chartTheme";

export function ConversionTrendsChart({ data }: { data: TrendPoint[] }) {
  const theme = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: theme.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: theme.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          unit="%"
          width={44}
        />
        <Tooltip content={<ChartTooltip formatter={(v: number) => `${v}%`} />} />
        <Line
          type="monotone"
          dataKey="value"
          name="Conversion"
          stroke="#f59e0b"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}