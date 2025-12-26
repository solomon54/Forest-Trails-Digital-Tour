// components/admin/bookings/BookingsTabHeader.tsx

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
    <div className="w-full overflow-x-auto border-b border-emerald-800/20">
      <div className="flex gap-2 sm:gap-4 min-w-max px-1 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-3 py-1.5 sm:px-4 sm:py-2
                text-sm sm:text-base
                font-medium rounded-md
                whitespace-nowrap
                transition-colors duration-200
                ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-emerald-100"
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
