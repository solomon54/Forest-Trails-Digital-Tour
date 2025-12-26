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
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 ${className}`}>
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Recent Activity
      </h2>
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-6 sm:py-8">No recent activity</p>
      ) : (
        <div className="space-y-4 sm:space-y-5">
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
      <Link
        href="/admin/activity-log"
        className="mt-4 sm:mt-6 inline-block text-indigo-600 font-medium hover:text-indigo-800 transition text-sm sm:text-base"
      >
        View full activity log →
      </Link>
    </div>
  );
}
