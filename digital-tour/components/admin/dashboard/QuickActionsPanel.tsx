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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <button className={`w-full py-5 bg-gradient-to-r ${action.gradient} text-white rounded-xl hover:shadow-xl transition-all duration-200 font-semibold text-lg transform hover:scale-105`}>
              {action.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}