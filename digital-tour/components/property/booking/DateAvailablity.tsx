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
    <div>
      <h2 className="text-2xl font-bold">Check-in & Check-out Dates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={onChange}
            min={today}
            className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={onChange}
            min={startDate || today}
            className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-400"
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onCheck}
          disabled={checking || !startDate || !endDate}
          className="px-10 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {checking ? "Checking..." : "Check Availability"}
        </button>
      </div>

      {isAvailable === true && (
        <div className="mt-6 p-5 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-center font-semibold">
          ✅ These dates are available! Continue below.
        </div>
      )}

      {isAvailable === false && (
        <div className="mt-6 p-5 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center font-semibold">
          ❌ {availabilityError || "Dates not available."}
        </div>
      )}

      {isAvailable === null && startDate && endDate && (
        <div className="mt-8 text-center text-gray-600">
          <p className="text-lg">↑ Click &quot;Check Availability&quot; to continue</p>
        </div>
      )}
    </div>
  );
};

export default DateAvailability;