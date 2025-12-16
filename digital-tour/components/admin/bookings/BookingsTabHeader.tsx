// components/admin/BookingsTabHeader.tsx
import React from "react";

interface TabHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = ["Pending", "Rejected", "Approved"];

export default function BookingsTabHeader({ activeTab, setActiveTab }: TabHeaderProps) {
  return (
    <div className="flex gap-4 border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 font-medium rounded-t-lg transition
            ${activeTab === tab
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
