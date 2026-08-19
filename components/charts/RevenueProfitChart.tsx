"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactINR } from "@/utils/format";
import { ChartTooltip, useChartTheme } from "./chartTheme";

export interface RevenueProfitPoint {
  label: string;
  value: number;
}

export function RevenueProfitChart({ data }: { data: RevenueProfitPoint[] }) {
  const theme = useChartTheme();
  const colors = ["#6366f1", "#10b981"];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: theme.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: theme.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCompactINR(v)}
          width={64}
        />
        <Tooltip content={<ChartTooltip formatter={(v: number) => formatCompactINR(v)} />} cursor={{ fill: theme.grid, fillOpacity: 0.4 }} />
        <Bar dataKey="value" name="Amount" radius={[6, 6, 0, 0]} animationDuration={800}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
