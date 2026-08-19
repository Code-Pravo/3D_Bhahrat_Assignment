"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { IndustrySlice } from "@/utils/calculations";
import { ChartTooltip, PALETTE, useChartTheme } from "./chartTheme";

export function IndustryDistributionChart({
  data,
  emptyLabel = "No investments yet",
}: {
  data: IndustrySlice[];
  emptyLabel?: string;
}) {
  const theme = useChartTheme();
  const total = data.reduce((acc, d) => acc + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        {emptyLabel}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="82%"
          paddingAngle={2}
          strokeWidth={0}
          animationDuration={800}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ fontSize: 11, color: theme.axis }}
        />
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fill: theme.axis, fontSize: 12 }}
        >
          {total} deals
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}