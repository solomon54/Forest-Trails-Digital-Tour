// components/notifications/NotificationsList.tsx
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import NotificationItem from "./NotificationItem";
import { BellIcon } from "@heroicons/react/24/outline";

type Props = {
  viewMode?: "user" | "admin";
};

export default function NotificationsList({ viewMode = "user" }: Props) {
  const { user } = useAuth();

  // The hook does the heavy lifting of filtering the Redux store
  const { notifications, unreadCount, loading, readOne } = useNotifications(
    user?.id,
    viewMode
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 animate-pulse border border-slate-100 shadow-sm">
            <div className="h-5 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6">
          <BellIcon className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900">All caught up!</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">
          {viewMode === "admin"
            ? "No system alerts currently require your attention."
            : "You don't have any personal notifications right now."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {unreadCount > 0 && (
        <div className="flex items-center gap-2 px-1">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">
            {unreadCount} New {unreadCount === 1 ? "Update" : "Updates"}
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {notifications.map((n) => (
          <NotificationItem
            key={n.id}
            notification={n}
            onMarkAsRead={readOne}
          />
        ))}
      </div>
    </div>
  );
}
