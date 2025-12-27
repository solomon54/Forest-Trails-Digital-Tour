import { Activity } from "./activity.types";
import ActivityAvatar from "./ActivityAvatar";
import ActivityStates from "./ActivityStates";
import { FiClock } from "react-icons/fi";

const ACTION_MAP: Record<string, string> = {
  grant_admin: "granted admin privileges to",
  revoke_admin: "revoked admin privileges from",
  approve_resource: "approved resource for",
  reject_resource: "rejected resource for",
  confirm_booking: "confirmed Booking",
  reject_booking: "rejected ",
  cancel_booking: "cancelled",
  update_listing: "updated",
  create_listing: "created",
};

function formatSmartDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffMinutes < 1) return `Just now • `;
  if (diffMinutes < 60) return `${diffMinutes} min ago • ${time}`;
  if (diffHours < 24) return `${diffHours} hr ago • ${time}`;
  if (diffDays === 1) return `Yesterday • ${time}`;
  if (diffDays < 7) return `${diffDays} days ago • ${time}`;

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


export default function ActivityCard({ activity }: { activity: Activity }) {
  const action =
    ACTION_MAP[activity.action] ?? activity.action.replace(/_/g, " ");

  // Determine target display
  let targetDisplay = activity.target.display
    ? activity.target.display.includes(`#${activity.target.id}`)
      ? activity.target.display
      : `${activity.target.display} (#${activity.target.id})`
    : `${activity.target.type} #${activity.target.id}`;

  // Append email for admin/user privilege actions
  if (["grant_admin", "revoke_admin"].includes(activity.action)) {
    const email = (activity.target as any).email; // target.email must be sent from API
    if (email) {
      targetDisplay = `${targetDisplay} (${email})`;
    }
  }

  return (
    <article className="bg-white sm:bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <ActivityAvatar
  name={activity.admin.name}
  imageUrl={activity.admin.photoUrl} // optional if you have a photo
  isOnline={activity.admin.isOnline} // <- this is critical
/>


        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Main action line */}
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
            <span className="font-semibold text-gray-900">{activity.admin.name}</span>{" "}
            <span className="text-gray-600">{action}</span>{" "}
            <span className="font-medium text-emerald-700">{targetDisplay}</span>
          </p>

          {/* Time */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <FiClock className="w-3.5 h-3.5" />
            <time>{formatSmartDate(activity.createdAt)}</time>
          </div>

          {/* Reason */}
          {activity.reason && (
            <div className="mt-2 sm:mt-3 text-sm bg-white border border-red-100 text-red-700 p-3 rounded-lg">
              <strong className="font-medium">Reason:</strong> {activity.reason}
            </div>
          )}

          {/* State diff */}
          <ActivityStates
            before={activity.states?.before}
            after={activity.states?.after}
          />
        </div>
      </div>
    </article>
  );
}
