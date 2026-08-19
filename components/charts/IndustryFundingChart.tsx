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
import type { IndustrySlice } from "@/utils/calculations";
import { formatCompactINR } from "@/utils/format";
import { ChartTooltip, PALETTE, useChartTheme } from "./chartTheme";

export function IndustryFundingChart({ data }: { data: IndustrySlice[] }) {
  const theme = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={theme.grid} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: theme.axis, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-28}
          textAnchor="end"
          height={54}
        />
        <YAxis
          tick={{ fill: theme.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCompactINR(v)}
          width={64}
        />
        <Tooltip content={<ChartTooltip formatter={(v: number) => formatCompactINR(v)} />} cursor={{ fill: theme.grid, fillOpacity: 0.4 }} />
        <Bar dataKey="value" name="Funding sought" radius={[4, 4, 0, 0]} animationDuration={800}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}