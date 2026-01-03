// pages/admin/notifications/index.tsx
import AdminLayout from "@/components/layout/AdminLayout";
import NotificationsList from "@/components/notifications/NotificationsList";
import { BellIcon } from "@heroicons/react/24/outline";

export default function AdminNotificationsPage() {
  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5 mb-10">
          <div className="p-4 bg-amber-100 rounded-full shadow-sm">
            <BellIcon className="h-10 w-10 text-amber-700" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Admin System Alerts
            </h1>
            <p className="text-slate-500 mt-1">
              Global system logs and high-priority warnings.
            </p>
          </div>
        </div>

        {/* Unified: List filters for is_admin: true */}
        <NotificationsList viewMode="user" />
      </div>
    </AdminLayout>
  );
}
