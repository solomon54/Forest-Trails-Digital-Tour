// components/admin/bookings/BookingsTabHeader.tsx
import React from "react";

export type BookingTab = "Pending" | "Approved" | "Rejected";

interface TabHeaderProps {
  activeTab: BookingTab;
  setActiveTab: (tab: BookingTab) => void;
}

const tabs: BookingTab[] = ["Pending", "Approved", "Rejected"];

export default function BookingsTabHeader({
  activeTab,
  setActiveTab,
}: TabHeaderProps) {
  return (
    <div className="overflow-x-auto w-full border-b-1 border-emerald-800/20 mb-4">
      <div className="flex gap-2 sm:gap-4 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium rounded-md transition duration-300 whitespace-nowrap
              ${
                activeTab === tab
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-emerald-600/70"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
