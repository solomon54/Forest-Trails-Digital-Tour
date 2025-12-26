// components/admin/dashboard/ui/ActivityItem.tsx
import React from "react";
import { HiClock } from "react-icons/hi";

interface Props {
  user: string;
  userInitial: string;
  action: string;
  target: string;
  time: string;
}

export default function ActivityItem({ user, userInitial, action, target, time }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 sm:py-5 border-b border-gray-100 last:border-0">
      {/* Avatar */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm sm:text-base shrink-0">
        {userInitial}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base text-gray-900 break-words">
          <span className="font-semibold">{user}</span> {action}{" "}
          <span className="font-semibold">{target}</span>
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1 whitespace-nowrap">
          <HiClock className="text-sm sm:text-base" /> {time}
        </p>
      </div>
    </div>
  );
}
