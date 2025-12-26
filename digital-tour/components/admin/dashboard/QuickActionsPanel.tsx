// components/admin/dashboard/QuickActionsPanel.tsx
import React from "react";
import Link from "next/link";

export default function QuickActionsPanel() {
  const actions = [
    { label: "Manage Users", href: "/admin/users", gradient: "from-indigo-500 to-purple-600" },
    { label: "View Bookings", href: "/admin/bookings", gradient: "from-emerald-500 to-teal-600" },
    { label: "Send Alert", href: "/admin/notifications", gradient: "from-amber-500 to-orange-600" },
    { label: "Add Resource", href: "/admin/resources", gradient: "from-purple-500 to-pink-600" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
    Quick Actions
  </h2>
  <div className="grid grid-cols-1 gap-3 sm:gap-4">
    {actions.map((action) => (
      <Link key={action.href} href={action.href}>
        <button
          className={`
            w-full py-4 sm:py-5
            bg-linear-to-r ${action.gradient}
            text-white rounded-xl
            text-base sm:text-lg
            font-semibold
            transition-all duration-200 transform hover:scale-105
          `}
        >
          {action.label}
        </button>
      </Link>
    ))}
  </div>
</div>

  );
}