// components/admin/dashboard/DashboardHeader.tsx
import React from "react";

interface Props {
  userName?: string | null;
}

export default function DashboardHeader({ userName }: Props) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const firstName = userName?.split(" ")[0] || "Admin";

  return (
    <header className="mb-8 sm:mb-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
        Welcome back, {firstName} 👋
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-4">{today}</p>
    </header>
  );
}
