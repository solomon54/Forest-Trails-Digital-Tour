// components/admin/dashboard/ui/MiniSparkline.tsx
import React from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

const data = [
  { value: 45 },
  { value: 52 },
  { value: 48 },
  { value: 61 },
  { value: 70 },
  { value: 78 },
  { value: 89 },
];

export default function MiniSparkline() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
        <defs>
          <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
            <stop offset="90%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          strokeWidth={3}
          fill="url(#emeraldGradient)"
          dot={false}
          animationDuration={1200}
          animationBegin={200}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}