// digital-tour/components/notifications/NotificationItem.tsx
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/store/slices/notificationSlice";

interface Props {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: Props) {
  const handleInteraction = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleInteraction}
      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
        notification.is_read
          ? "bg-white border-gray-100"
          : "bg-emerald-50 border-emerald-200 shadow-sm"
      }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3
            className={`font-semibold ${
              notification.is_read ? "text-gray-700" : "text-emerald-900"
            }`}>
            {notification.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-3">
            {notification.created_at
              ? formatDistanceToNow(new Date(notification.created_at), {
                  addSuffix: true,
                })
              : "Just now"}
          </p>
        </div>
        {!notification.is_read && (
          <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-pulse mt-2" />
        )}
      </div>
    </div>
  );
}

/*// components/notifications/NotificationItem.tsx
import { formatDistanceToNow } from "date-fns";

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string | null;
};

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}) {
  // Safe date formatting
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Date unknown";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
      className={`
        bg-white rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 p-5 sm:p-6
        ${
          notification.read
            ? "border-slate-200"
            : "border-emerald-300 bg-emerald-50/70"
        }
      `}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-base sm:text-lg wrap-break-word ${
              notification.read ? "text-slate-800" : "text-emerald-900"
            }`}>
            {notification.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            {notification.message}
          </p>
          <p className="text-xs text-slate-500 mt-3">
            {formatDate(notification.createdAt)}
          </p>
        </div>
        {!notification.read && (
          <div className="shrink-0 self-center">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
*/
