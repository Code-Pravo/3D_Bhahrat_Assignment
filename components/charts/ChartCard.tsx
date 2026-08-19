import type { ReactNode } from "react";
import { DashboardCard } from "@/components/common/DashboardCard";

export function ChartCard({
  title,
  subtitle,
  height = 280,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  height?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <DashboardCard title={title} subtitle={subtitle} className={className}>
      <div className="w-full" style={{ height }}>
        {children}
      </div>
    </DashboardCard>
  );
}
