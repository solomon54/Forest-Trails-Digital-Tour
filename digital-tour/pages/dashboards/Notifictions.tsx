//pages/dashboards/Notifictions.tsx
import {useAuth} from "@/hooks/useAuth";
import {useNotifications} from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    markRead,
  } = useNotifications(user?.id);

  if (!user) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Notifications
        {unreadCount > 0 && (
          <span className="ml-2 text-sm bg-red-500 text-white px-2 py-1 rounded">
            {unreadCount}
          </span>
        )}
      </h1>

      {loading && <p>Loading notifications…</p>}

      {!loading && notifications.length === 0 && (
        <p className="text-gray-500">No notifications yet.</p>
      )}

      <ul className="space-y-3">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`p-4 border rounded cursor-pointer ${
              n.is_read ? "bg-white" : "bg-blue-50"
            }`}
            onClick={() => !n.is_read && markRead(n.id)}
          >
            <h3 className="font-medium">{n.title}</h3>
            <p className="text-sm text-gray-600">{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
