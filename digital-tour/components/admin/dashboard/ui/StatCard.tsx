// components/admin/dashboard/ui/StatCard.tsx
import React from "react";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import dynamic from "next/dynamic";

const MiniSparkline = dynamic(() => import("./MiniSparkline"), { ssr: false });

/* =======================
   Public Types
   ======================= */

export type StatTrend = "up" | "down" | "neutral";
export type StatColor = "blue" | "emerald" | "amber" | "purple" | "indigo";

export interface StatCardProps {
  title: string;
  value: number | string;
  change?: string;
  trend?: StatTrend;
  icon: React.ReactNode;
  color: StatColor;
  sparkline?: boolean;
}

/* =======================
   Styling Map
   ======================= */

const colorClasses: Record<StatColor, string> = {
  blue: "bg-blue-50/90 text-blue-700 border-blue-200",
  emerald: "bg-emerald-50/90 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50/90 text-amber-700 border-amber-200",
  purple: "bg-purple-50/90 text-purple-700 border-purple-200",
  indigo: "bg-indigo-50/90 text-indigo-700 border-indigo-200",
};

/* =======================
   Component
   ======================= */

export default function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  color,
  sparkline,
}: StatCardProps) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border ${colorClasses[color]} p-6 hover:shadow-md transition`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>

          <p className="text-3xl lg:text-4xl font-bold mt-3 text-gray-900">
            {formattedValue}
          </p>

          {change && (
            <p
              className={`text-xs lg:text-sm font-medium mt-3 flex items-center gap-1 ${
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {trend === "up" && <HiTrendingUp />}
              {trend === "down" && <HiTrendingDown />}
              {change}
            </p>
          )}
        </div>

        <div className={`p-3 lg:p-4 rounded-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>

      {sparkline && (
        <div className="mt-8 -mx-6 -mb-6 h-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/50 to-transparent z-10" />
          <MiniSparkline />
        </div>
      )}
    </div>
  );
}
