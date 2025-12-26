// components/admin/dashboard/ActivityFeed.tsx
import React from "react";
import Link from "next/link";
import ActivityItem from "./ui/ActivityItem";

interface Activity {
  id: number;
  userName: string;
  userInitial: string;
  action: string;
  target: string;
  timestamp: string;
}

interface Props {
  activities: Activity[];
  className?: string;
}

export default function ActivityFeed({ activities, className = "" }: Props) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-8 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent activity</p>
      ) : (
        <div>
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              user={activity.userName}         
              userInitial={activity.userInitial} 
              action={activity.action}
              target={activity.target}
              time={activity.timestamp}
            />

          ))}
        </div>
      )}
      <Link href="/admin/activity-log" className="mt-8 inline-block text-indigo-600 font-medium hover:text-indigo-800 transition">
        View full activity log →
      </Link>
    </div>
  );
}