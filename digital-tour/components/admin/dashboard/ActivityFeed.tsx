// components/admin/dashboard/ActivityFeed.tsx
import React from "react";
import Link from "next/link";
import ActivityItem from "./ui/ActivityItem";

interface Props {
  className?: string;
}

export default function ActivityFeed({ className = "" }: Props) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-8 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
      <div>
        <ActivityItem user="Sarah Chen" action="granted admin access to" target="mike@company.com" time="2 hours ago" />
        <ActivityItem user="System" action="created new resource" target="Conference Room A" time="5 hours ago" />
        <ActivityItem user="John Doe" action="booked" target="Projector Suite" time="Yesterday, 3:42 PM" />
        <ActivityItem user="Emma Wilson" action="sent notification to" target="All Users" time="Dec 25, 2025" />
      </div>
      <Link href="/admin/activity-log" className="mt-8 inline-block text-indigo-600 font-medium hover:text-indigo-800 transition">
        View full activity log →
      </Link>
    </div>
  );
}