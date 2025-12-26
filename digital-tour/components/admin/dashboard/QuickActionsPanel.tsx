// components/admin/dashboard/QuickActionsPanel.tsx
import Link from "next/link";

export default function QuickActionsPanel() {
  const actions = [
    { label: "Manage Users", href: "/admin/users", gradient: "from-indigo-500 to-purple-600" },
    { label: "View Bookings", href: "/admin/bookings", gradient: "from-emerald-500 to-teal-600" },
    { label: "Send Alert", href: "/admin/notifications", gradient: "from-amber-500 to-orange-600" },
    { label: "Add Resource", href: "/admin/resources", gradient: "from-purple-500 to-pink-600" },
  ];

  return (
    <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-8">
      <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 gap-2 sm:gap-4">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="block">
            <button
              className={`
                w-full min-h-[44px]
                px-4 py-3 sm:py-5
                bg-linear-to-r ${action.gradient}
                text-white
                rounded-lg sm:rounded-xl
                text-sm sm:text-lg
                font-medium sm:font-semibold
                transition-all
                active:scale-95
                sm:hover:scale-105
                sm:hover:shadow-lg
              `}
            >
              {action.label}
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
}
