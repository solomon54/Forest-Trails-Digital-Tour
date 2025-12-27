// components/property/booking/DateAvailability.tsx
import { ChangeEvent } from "react";

interface Props {
  startDate: string;
  endDate: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCheck: () => void;
  checking: boolean;
  isAvailable: boolean | null;
  availabilityError: string | null;
  today: string;
}

// const DateAvailability: React.FC<Props> = ({
const DateAvailability: React.FC<Props> = ({
  startDate,
  endDate,
  onChange,
  onCheck,
  checking,
  isAvailable,
  availabilityError,
  today,
}) => {
  return (
    <div className="bg-white p-3 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
  <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Check-in & Check-out Dates</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-5">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
      <input
        type="date"
        name="startDate"
        value={startDate}
        onChange={onChange}
        min={today}
        className="text-gray-500 border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
      <input
        type="date"
        name="endDate"
        value={endDate}
        onChange={onChange}
        min={startDate || today}
        className="text-gray-500 border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
      />
    </div>
  </div>

  <div className="mt-6 flex justify-center">
    <button
      type="button"
      onClick={onCheck}
      disabled={checking || !startDate || !endDate}
      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {checking ? "Checking..." : "Check Availability"}
    </button>
  </div>

  {isAvailable === true && (
    <div className="mt-6 p-2 sm:p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-center font-medium text-sm sm:text-base">
      ✅ These dates are available! Continue below.
    </div>
  )}

  {isAvailable === false && (
    <div className="mt-6 p-2 sm:p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center font-medium text-sm sm:text-base">
      ❌ {availabilityError || "Dates not available."}
    </div>
  )}

  {isAvailable === null && startDate && endDate && (
    <div className="mt-6 text-center text-gray-600 text-sm sm:text-base">
      ↑ Click &quot;Check Availability&quot; to continue
    </div>
  )}
</div>

  );
};

export default DateAvailability;