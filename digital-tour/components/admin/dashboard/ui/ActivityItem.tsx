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

export default function ActivityItem({user, userInitial, action, target, time }: Props) {
  return (
    <div className="flex items-center gap-4 py-5 border-b border-gray-100 last:border-0">
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
        {userInitial}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">
          <span className="font-semibold">{user}</span> {action}{" "}
          <span className="font-semibold">{target}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <HiClock className="text-sm" /> {time}
        </p>
      </div>
    </div>
  );
}