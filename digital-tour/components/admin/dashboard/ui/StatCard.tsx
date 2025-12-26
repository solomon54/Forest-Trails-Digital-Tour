// components/admin/dashboard/ui/StatCard.tsx
import React from "react";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import dynamic from "next/dynamic";

const MiniSparkline = dynamic(() => import("./MiniSparkline"), { ssr: false });

interface Props {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: "blue" | "emerald" | "amber" | "purple" | "indigo";
  sparkline?: boolean;
}

const colorClasses = {
  blue: "bg-blue-50/90 text-blue-700 border-blue-200",
  emerald: "bg-emerald-50/90 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50/90 text-amber-700 border-amber-200",
  purple: "bg-purple-50/90 text-purple-700 border-purple-200",
  indigo: "bg-indigo-50/90 text-indigo-700 border-indigo-200",
};

export default function StatCard({ title, value, change, trend = "neutral", icon, color, sparkline }: Props) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${colorClasses[color]} p-6 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-4xl font-bold mt-3 text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-3 flex items-center gap-1 ${trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}>
              {trend === "up" && <HiTrendingUp className="text-lg" />}
              {trend === "down" && <HiTrendingDown className="text-lg" />}
              {change}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      {sparkline && (
  <div className="mt-8 -mx-6 -mb-6 h-32 relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-t from-white via-white/50 to-transparent z-10"></div>
    <MiniSparkline />
  </div>
)}
    </div>
  );
}